import express, { NextFunction, Request, Response, Router } from "express";
import { db } from "@repo/db/client";
import { eq } from "@repo/db";
import { insertServiceSchema, services, usersHasRules } from "@repo/db/schema";
import logger from "../utils/logger";

const servicesRoutes = Router();

servicesRoutes.post("/services", async (req: Request, res: Response, next: NextFunction) => {
  const currentUserId = req.query.userId as string | undefined;

  logger.info({ body: req.body, query: req.query }, "Requisição POST /services");

  if (!currentUserId) {
    logger.warn("ID do usuário não fornecido");
    return res.status(400).json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
  }

  const result = insertServiceSchema.safeParse(req.body);

  if (!result.success) {
    logger.warn({ errors: result.error.errors }, "Validação falhou no POST /services");
    return res.status(400).json({
      error: "Validação falhou",
      details: result.error.errors,
    });
  }

  const { type, description, price, scheduledAt, status } = result.data;

  const newService = {
    id: crypto.randomUUID(),
    type,
    description: description || null,
    price: price.toString(),
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    status: status || "pending",
    createdBy: currentUserId,
    createdAt: new Date(),
  };

  try {
    const [insertedService] = await db.insert(services).values(newService).returning();

    logger.info({ service: insertedService }, "Serviço criado com sucesso");
    return res.status(201).json({
      message: "Serviço criado com sucesso",
      service: insertedService,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error: error.message }, "Erro ao criar serviço");
      return res.status(500).json({ error: "Erro ao salvar agendamento" });
    } else {
      logger.error({ error }, "Erro desconhecido ao criar serviço");
      return res.status(500).json({ error: "Erro desconhecido ocorreu" });
    }
  }
});
servicesRoutes.get("/services", async (req: Request, res: Response, next: NextFunction) => {
  const currentUserId = req.query.userId as string | undefined;
  const initial = parseInt(req.query.initial as string);
  const limit = parseInt(req.query.limit as string);

  logger.info({ query: req.query }, "Requisição GET /services");

  // Primeiro, verifica se o userId foi fornecido
  if (!currentUserId) {
    logger.warn("ID do usuário não fornecido");
    return res.status(400).json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
  }

  // Depois, valida 'initial' e 'limit'
  if (isNaN(initial) || isNaN(limit)) {
    logger.warn("Parâmetros 'initial' e 'limit' são obrigatórios e devem ser números");
    return res.status(400).json({ error: "'initial' e 'limit' são obrigatórios e devem ser números" });
  }

  if (initial < 0 || limit < 0 || limit < initial) {
    logger.warn("Parâmetros inválidos de 'initial' e 'limit'");
    return res.status(400).json({ error: "Parâmetros inválidos de 'initial' e 'limit'" });
  }

  try {
    const [userRule] = await db
      .select()
      .from(usersHasRules)
      .where(eq(usersHasRules.userId, currentUserId))
      .execute();

    const isAdmin = userRule?.rule === "Admin";

    let serviceList;

    if (isAdmin) {
      serviceList = await db
        .select()
        .from(services)
        .limit(limit - initial)
        .offset(initial)
        .execute();
    } else {
      serviceList = await db
        .select()
        .from(services)
        .where(eq(services.createdBy, currentUserId))
        .limit(limit - initial)
        .offset(initial)
        .execute();
    }

    logger.info({ services: serviceList }, "Serviços recuperados com sucesso");
    return res.status(200).json(serviceList);
  } catch (error) {
    logger.error({ error }, "Erro ao resgatar serviços");
    return res.status(500).json({ error: "Falha ao buscar serviços" });
  }
});



servicesRoutes.get("/services/:id", async (req: Request, res: Response, next: NextFunction) => {
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
});

servicesRoutes.put("/services/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const currentUserId = req.query.userId as string | undefined;

  logger.info({ body: req.body, params: req.params, query: req.query }, "Requisição PUT /services/:id");

  if (!id) {
    logger.warn("ID do serviço não fornecido");
    return res.status(400).json({ error: "ID do serviço é obrigatório" });
  }

  if (!currentUserId) {
    logger.warn("ID do usuário não fornecido");
    return res.status(400).json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
  }

  const result = insertServiceSchema.partial().safeParse(req.body);

  if (!result.success) {
    logger.warn({ errors: result.error.errors }, "Validação falhou no PUT /services/:id");
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

    const [userRule] = await db
      .select()
      .from(usersHasRules)
      .where(eq(usersHasRules.userId, currentUserId))
      .execute();

    const isAdmin = userRule?.rule === "Admin";

    if (existingService.createdBy !== currentUserId && !isAdmin) {
      logger.warn({ currentUserId, serviceOwner: existingService.createdBy }, "Permissão negada para atualizar serviço");
      return res.status(403).json({ error: "Você não tem permissão para atualizar este serviço" });
    }

    const updatedFields: Partial<typeof services.$inferInsert> = {};
    if (updateData.type) updatedFields.type = updateData.type;
    if (updateData.description !== undefined) updatedFields.description = updateData.description;
    if (updateData.price) updatedFields.price = updateData.price.toString();
    if (updateData.scheduledAt) updatedFields.scheduledAt = new Date(updateData.scheduledAt);
    if (updateData.status) updatedFields.status = updateData.status;
    if (updateData.createdBy) updatedFields.createdBy = updateData.createdBy;

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
});

servicesRoutes.delete("/services/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const currentUserId = req.query.userId as string | undefined;

  logger.info({ params: req.params, query: req.query }, "Requisição DELETE /services/:id");

  if (!id) {
    logger.warn("ID do serviço não fornecido");
    return res.status(400).json({ error: "ID do serviço é obrigatório" });
  }

  if (!currentUserId) {
    logger.warn("ID do usuário não fornecido");
    return res.status(400).json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
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

    const [userRule] = await db
      .select()
      .from(usersHasRules)
      .where(eq(usersHasRules.userId, currentUserId))
      .execute();

    const isAdmin = userRule?.rule === "Admin";

    if (service.createdBy !== currentUserId && !isAdmin) {
      logger.warn({ currentUserId, serviceOwner: service.createdBy }, "Permissão negada para deletar serviço");
      return res.status(403).json({ error: "Você não tem permissão para deletar este serviço" });
    }

    await db.delete(services).where(eq(services.id, id)).execute();

    logger.info({ id }, "Serviço deletado com sucesso");
    return res.status(200).json({
      message: "Serviço deletado com sucesso",
    });
  } catch (error) {
    logger.error({ error }, "Erro ao deletar serviço");
    return res.status(500).json({ error: "Falha ao deletar serviço" });
  }
});

export default servicesRoutes;
