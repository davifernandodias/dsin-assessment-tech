import express, { NextFunction, Request, Response, Router } from "express";
import { db } from "@repo/db/client";
import { eq } from "@repo/db";
import { insertServiceSchema, services, serviceTypes, insertServiceTypeSchema, users } from "@repo/db/schema";
import logger from "../utils/logger";

const servicesRoutes = Router();

const checkUserRole = async (req: Request, res: Response, next: NextFunction) => {
  const currentUserId = req.query.userId as string | undefined;

  if (!currentUserId) {
    logger.warn("ID do usuário não fornecido");
    return res
      .status(400)
      .json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUserId))
      .execute();

    if (!user) {
      logger.warn({ userId: currentUserId }, "Usuário não encontrado");
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    (req as any).userRole = user.role;
    next();
  } catch (error) {
    logger.error({ error }, "Erro ao verificar role do usuário");
    return res.status(500).json({ error: "Erro ao verificar permissões" });
  }
};


servicesRoutes.post(
  "/services",
  checkUserRole,
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).userRole !== "Admin") {
      return res.status(403).json({ error: "Apenas Admins podem criar serviços" });
    }


    logger.info({ body: req.body, query: req.query }, "Requisição POST /services");

    const result = insertServiceSchema.safeParse(req.body);

    if (!result.success) {
      logger.warn({ errors: result.error.errors }, "Validação falhou no POST /services");
      return res.status(400).json({
        error: "Validação falhou",
        details: result.error.errors,
      });
    }

    const { typeId, description, price, durationMinutes } = result.data;

    const [existingTypeById] = await db
      .select()
      .from(serviceTypes)
      .where(eq(serviceTypes.id, typeId))
      .execute();

    if (!existingTypeById) {
      const newServiceType = {
        id: typeId,
        name: typeId,
      };

      const typeResult = insertServiceTypeSchema.safeParse(newServiceType);
      if (!typeResult.success) {
        logger.warn({ errors: typeResult.error.errors }, "Validação do novo tipo de serviço falhou");
        return res.status(400).json({
          error: "Validação do tipo de serviço falhou",
          details: typeResult.error.errors,
        });
      }

      const insertedTypes = await db
        .insert(serviceTypes)
        .values(newServiceType)
        .returning();

      const insertedType = insertedTypes[0];
      if (!insertedType) {
        logger.error("Falha ao inserir novo tipo de serviço");
        return res.status(500).json({ error: "Erro ao criar tipo de serviço" });
      }

      logger.info({ serviceType: insertedType }, "Novo tipo de serviço criado com sucesso");
    }

    const newService = {
      id: req.body.id || crypto.randomUUID(),
      typeId,
      description: description || null,
      price: price.toString(),
      durationMinutes,
      createdAt: new Date(),
    };

    try {
      const [insertedService] = await db
        .insert(services)
        .values(newService)
        .returning();

      logger.info({ service: insertedService }, "Serviço criado com sucesso");
      return res.status(201).json({
        message: "Serviço criado com sucesso",
        service: insertedService,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error({ error: error.message }, "Erro ao criar serviço");
        return res.status(500).json({ error: "Erro ao salvar serviço" });
      } else {
        logger.error({ error }, "Erro desconhecido ao criar serviço");
        return res.status(500).json({ error: "Erro desconhecido ocorreu" });
      }
    }
  }
);

servicesRoutes.put(
  "/services/:id",
  checkUserRole,
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).userRole !== "Admin") {
      return res.status(403).json({ error: "Apenas Admins podem atualizar serviços" });
    }

    const { id } = req.params;

    logger.info(
      { body: req.body, params: req.params, query: req.query },
      "Requisição PUT /services/:id"
    );

    if (!id) {
      logger.warn("ID do serviço não fornecido");
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    const result = insertServiceSchema.partial().safeParse(req.body);

    if (!result.success) {
      logger.warn(
        { errors: result.error.errors },
        "Validação falhou no PUT /services/:id"
      );
      return res.status(400).json({
        error: "Validação falhou",
        details: result.error.errors,
      });
    }

    const updateData = result.data;

    try {
      const [existingService] = await db
        .select()
        .from(services)
        .where(eq(services.id, id))
        .execute();

      if (!existingService) {
        logger.warn({ id }, "Serviço não encontrado para atualização");
        return res.status(404).json({ error: "Serviço não encontrado" });
      }

      const updatedFields: Partial<typeof services.$inferInsert> = {};

      if (updateData.typeId) {
        const [existingTypeById] = await db
          .select()
          .from(serviceTypes)
          .where(eq(serviceTypes.id, updateData.typeId))
          .execute();

        if (!existingTypeById) {
          const newServiceType = {
            id: updateData.typeId,
            name: updateData.typeId,
          };

          const typeResult = insertServiceTypeSchema.safeParse(newServiceType);
          if (!typeResult.success) {
            logger.warn({ errors: typeResult.error.errors }, "Validação do novo tipo de serviço falhou");
            return res.status(400).json({
              error: "Validação do tipo de serviço falhou",
              details: typeResult.error.errors,
            });
          }

          const insertedTypes = await db
            .insert(serviceTypes)
            .values(newServiceType)
            .returning();

          const insertedType = insertedTypes[0];
          if (!insertedType) {
            logger.error("Falha ao inserir novo tipo de serviço");
            return res.status(500).json({ error: "Erro ao criar tipo de serviço" });
          }

          logger.info({ serviceType: insertedType }, "Novo tipo de serviço criado com sucesso");
        }
        updatedFields.typeId = updateData.typeId;
      }

      if (updateData.description !== undefined) updatedFields.description = updateData.description;
      if (updateData.price) updatedFields.price = updateData.price.toString();
      if (updateData.durationMinutes) updatedFields.durationMinutes = updateData.durationMinutes;

      const [updatedService] = await db
        .update(services)
        .set(updatedFields)
        .where(eq(services.id, id))
        .returning();

      logger.info({ updatedService }, "Serviço atualizado com sucesso");
      return res.status(200).json({
        message: "Serviço atualizado com sucesso",
        service: updatedService,
      });
    } catch (error) {
      logger.error({ error }, "Erro ao atualizar serviço");
      return res.status(500).json({ error: "Falha ao atualizar serviço" });
    }
  }
);

servicesRoutes.get(
  "/services",
  checkUserRole,
  async (req: Request, res: Response, next: NextFunction) => {
    const initial = parseInt(req.query.initial as string);
    const limit = parseInt(req.query.limit as string);

    logger.info({ query: req.query }, "Requisição GET /services");

    if (isNaN(initial) || isNaN(limit)) {
      logger.warn("Parâmetros 'initial' e 'limit' são obrigatórios e devem ser números");
      return res
        .status(400)
        .json({ error: "'initial' e 'limit' são obrigatórios e devem ser números" });
    }

    if (initial < 0 || limit < 0 || limit < initial) {
      logger.warn("Parâmetros inválidos de 'initial' e 'limit'");
      return res
        .status(400)
        .json({ error: "Parâmetros inválidos de 'initial' e 'limit'" });
    }

    try {
      const serviceList = await db
        .select()
        .from(services)
        .limit(limit - initial)
        .offset(initial)
        .execute();

      logger.info({ services: serviceList }, "Serviços recuperados com sucesso");
      return res.status(200).json(serviceList);
    } catch (error) {
      logger.error({ error }, "Erro ao resgatar serviços");
      return res.status(500).json({ error: "Falha ao buscar serviços" });
    }
  }
);

servicesRoutes.get(
  "/services/:id",
  checkUserRole,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    logger.info({ params: req.params }, "Requisição GET /services/:id");

    if (!id) {
      logger.warn("ID do serviço não fornecido");
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    try {
      const service = await db
        .select()
        .from(services)
        .where(eq(services.id, id))
        .execute();

      if (service.length === 0) {
        logger.warn({ id }, "Serviço não encontrado");
        return res.status(404).json({ error: "Serviço não encontrado" });
      }

      logger.info({ service: service[0] }, "Serviço recuperado com sucesso");
      return res.status(200).json({
        message: "Resgatado serviço com sucesso",
        service: service[0],
      });
    } catch (error) {
      logger.error({ error }, "Erro ao buscar serviço");
      return res.status(500).json({ error: "Falha ao buscar serviço" });
    }
  }
);

servicesRoutes.get(
  "/service-types",
  checkUserRole,
  async (req: Request, res: Response, next: NextFunction) => {
    const initial = parseInt(req.query.initial as string);
    const limit = parseInt(req.query.limit as string);

    logger.info({ query: req.query }, "Requisição GET /service-types");

    if (isNaN(initial) || isNaN(limit)) {
      logger.warn("Parâmetros 'initial' e 'limit' são obrigatórios e devem ser números");
      return res
        .status(400)
        .json({ error: "'initial' e 'limit' são obrigatórios e devem ser números" });
    }

    if (initial < 0 || limit < 0 || limit < initial) {
      logger.warn("Parâmetros inválidos de 'initial' e 'limit'");
      return res
        .status(400)
        .json({ error: "Parâmetros inválidos de 'initial' e 'limit'" });
    }

    try {
      const serviceTypeList = await db
        .select()
        .from(serviceTypes)
        .limit(limit - initial)
        .offset(initial)
        .execute();

      logger.info(
        { serviceTypes: serviceTypeList },
        "Tipos de serviço recuperados com sucesso"
      );
      return res.status(200).json(serviceTypeList);
    } catch (error) {
      logger.error({ error }, "Erro ao resgatar tipos de serviço");
      return res.status(500).json({ error: "Falha ao buscar tipos de serviço" });
    }
  }
);

servicesRoutes.get(
  "/service-types/:id",
  checkUserRole,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    logger.info({ params: req.params }, "Requisição GET /service-types/:id");

    if (!id) {
      logger.warn("ID do tipo de serviço não fornecido");
      return res.status(400).json({ error: "ID do tipo de serviço é obrigatório" });
    }

    try {
      const serviceType = await db
        .select()
        .from(serviceTypes)
        .where(eq(serviceTypes.id, id))
        .execute();

      if (serviceType.length === 0) {
        logger.warn({ id }, "Tipo de serviço não encontrado");
        return res.status(404).json({ error: "Tipo de serviço não encontrado" });
      }

      logger.info(
        { serviceType: serviceType[0] },
        "Tipo de serviço recuperado com sucesso"
      );
      return res.status(200).json({
        message: "Resgatado tipo de serviço com sucesso",
        serviceType: serviceType[0],
      });
    } catch (error) {
      logger.error({ error }, "Erro ao buscar tipo de serviço");
      return res.status(500).json({ error: "Falha ao buscar tipo de serviço" });
    }
  }
);

servicesRoutes.delete(
  "/services/:id",
  checkUserRole,
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).userRole !== "Admin") {
      return res.status(403).json({ error: "Apenas Admins podem deletar serviços" });
    }

    const { id } = req.params;

    logger.info(
      { params: req.params, query: req.query },
      "Requisição DELETE /services/:id"
    );

    if (!id) {
      logger.warn("ID do serviço não fornecido");
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    try {
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, id))
        .execute();

      if (!service) {
        logger.warn({ id }, "Serviço não encontrado para deleção");
        return res.status(404).json({ error: "Serviço não encontrado" });
      }

      const typeId = service.typeId;
      await db.delete(services).where(eq(services.id, id)).execute();

      const remainingServices = await db
        .select()
        .from(services)
        .where(eq(services.typeId, typeId))
        .execute();

      if (remainingServices.length === 0) {
        await db.delete(serviceTypes).where(eq(serviceTypes.id, typeId)).execute();
      }

      logger.info(
        { serviceId: id, typeId },
        "Serviço deletado com sucesso"
      );
      return res.status(200).json({
        message: "Serviço deletado com sucesso",
      });
    } catch (error) {
      logger.error({ error }, "Erro ao deletar serviço");
      return res
        .status(500)
        .json({ error: "Falha ao deletar serviço" });
    }
  }
);

export default servicesRoutes;