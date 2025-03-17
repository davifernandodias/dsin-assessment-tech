import express, { NextFunction, Request, Response, Router } from "express";
import { db } from "@repo/db/client";
import { eq } from "@repo/db";
import { insertServiceSchema, services, usersHasRules } from "@repo/db/schema";
import logger from "../utils/logger";

const servicesRoutes = Router();

servicesRoutes.post("/services", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.query.userId as string | undefined;

    if (!currentUserId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

    const result = insertServiceSchema.safeParse(req.body);

    if (!result.success) {
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

    const [insertedService] = await db.insert(services).values(newService).returning();

    return res.status(201).json({
      message: "Serviço criado com sucesso",
      service: insertedService,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ error: error.message }, "Erro ao criar serviço");
      return res.status(500).json({ error: "Erro ao salvar agendamento" });
    } else {
      logger.error({ error }, "Erro desconhecido");
      return res.status(500).json({ error: "Erro desconhecido ocorreu" });
    }
  }
});

servicesRoutes.get("/services", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.query.userId as string | undefined;

    if (!currentUserId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

    const [userRule] = await db
      .select()
      .from(usersHasRules)
      .where(eq(usersHasRules.userId, currentUserId))
      .execute();

    const isAdmin = userRule?.rule === "Admin";

    let serviceList;

    if (isAdmin) {
      serviceList = await db.select().from(services).execute();
    } else {
      serviceList = await db
        .select()
        .from(services)
        .where(eq(services.createdBy, currentUserId))
        .execute();
    }

    return res.status(200).json(serviceList);
  } catch (error) {
    logger.error({ error }, "Erro ao resgatar serviços");
    return res.status(500).json({ error: "Falha ao buscar serviços" });
  }
});

servicesRoutes.get("/services/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    const service = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .execute();

    if (service.length === 0) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

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
  try {
    const { id } = req.params;
    const currentUserId = req.query.userId as string | undefined;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    if (!currentUserId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

    const result = insertServiceSchema.partial().safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validação falhou",
        details: result.error.errors,
      });
    }

    const updateData = result.data;

    const [existingService] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .execute();

    if (!existingService) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    const [userRule] = await db
      .select()
      .from(usersHasRules)
      .where(eq(usersHasRules.userId, currentUserId))
      .execute();

    const isAdmin = userRule?.rule === "Admin";

    if (existingService.createdBy !== currentUserId && !isAdmin) {
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
  try {
    const { id } = req.params;
    const currentUserId = req.query.userId as string | undefined;

    if (!id) {
      return res.status(400).json({ error: "ID do serviço é obrigatório" });
    }

    if (!currentUserId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .execute();

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    const [userRule] = await db
      .select()
      .from(usersHasRules)
      .where(eq(usersHasRules.userId, currentUserId))
      .execute();

    const isAdmin = userRule?.rule === "Admin";

    if (service.createdBy !== currentUserId && !isAdmin) {
      return res.status(403).json({ error: "Você não tem permissão para deletar este serviço" });
    }

    await db.delete(services).where(eq(services.id, id)).execute();

    return res.status(200).json({
      message: "Serviço deletado com sucesso",
    });
  } catch (error) {
    logger.error({ error }, "Erro ao deletar serviço");
    return res.status(500).json({ error: "Falha ao deletar serviço" });
  }
});

export default servicesRoutes;