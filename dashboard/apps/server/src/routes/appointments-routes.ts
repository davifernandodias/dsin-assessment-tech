import express, { NextFunction, Request, Response, Router } from "express";
import logger from "../utils/logger";
import { db } from "@repo/db/client";
import { eq } from "@repo/db"; 
import { appointments, insertAppointmentSchema, users, services } from "@repo/db/schema";

const appointmentsRoutes = Router();

appointmentsRoutes.post(
  "/appointments",
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.query.userId as string | undefined;

    logger.info({ body: req.body, query: req.query }, "Requisição POST /appointments");

    if (!currentUserId) {
      logger.warn("ID do usuário não fornecido");
      return res
        .status(400)
        .json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

    const result = insertAppointmentSchema.safeParse({
      ...req.body,
      scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined,
    });

    if (!result.success) {
      logger.warn({ errors: result.error.errors }, "Validação falhou no POST /appointments");
      return res.status(400).json({
        error: "Validação falhou",
        details: result.error.errors,
      });
    }

    const { clientId, stylistId, serviceId, scheduledAt, status } = result.data;

    const [client] = await db.select().from(users).where(eq(users.id, clientId)).execute();
    if (!client) {
      logger.warn({ clientId }, "Cliente não encontrado");
      return res.status(400).json({ error: "Cliente inválido" });
    }

    const [stylist] = await db.select().from(users).where(eq(users.id, stylistId)).execute();
    if (!stylist) {
      logger.warn({ stylistId }, "Estilista não encontrado");
      return res.status(400).json({ error: "Estilista inválido" });
    }

    const [service] = await db.select().from(services).where(eq(services.id, serviceId)).execute();
    if (!service) {
      logger.warn({ serviceId }, "Serviço não encontrado");
      return res.status(400).json({ error: "Serviço inválido" });
    }

    const newAppointment = {
      id: crypto.randomUUID(),
      clientId,
      stylistId,
      serviceId,
      scheduledAt,
      status: status || "pending",
      createdAt: new Date(),
    };

    try {
      const [insertedAppointment] = await db
        .insert(appointments)
        .values(newAppointment)
        .returning();

      logger.info({ appointment: insertedAppointment }, "Agendamento criado com sucesso");
      return res.status(201).json({
        message: "Agendamento criado com sucesso",
        appointment: insertedAppointment,
      });
    } catch (error) {
      logger.error({ error }, "Erro ao criar agendamento");
      return res.status(500).json({ error: "Erro ao salvar agendamento" });
    }
  }
);

appointmentsRoutes.get(
  "/appointments",
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.query.userId as string | undefined;
    const initial = parseInt(req.query.initial as string);
    const limit = parseInt(req.query.limit as string);

    logger.info({ query: req.query }, "Requisição GET /appointments");

    if (!currentUserId) {
      logger.warn("ID do usuário não fornecido");
      return res
        .status(400)
        .json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

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
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, currentUserId))
        .execute();

      if (!currentUser) {
        logger.warn({ currentUserId }, "Usuário atual não encontrado");
        return res.status(404).json({ error: "Usuário atual não encontrado" });
      }

      let appointmentList;
      if (currentUser.role === "Admin") {
        appointmentList = await db
          .select()
          .from(appointments)
          .limit(limit - initial)
          .offset(initial)
          .execute();
      } else {
        appointmentList = await db
          .select()
          .from(appointments)
          .where(
            eq(appointments.clientId, currentUserId) || eq(appointments.stylistId, currentUserId)
          )
          .limit(limit - initial)
          .offset(initial)
          .execute();
      }

      logger.info(
        { appointments: appointmentList },
        "Agendamentos recuperados com sucesso"
      );
      return res.status(200).json(appointmentList);
    } catch (error) {
      logger.error({ error }, "Erro ao resgatar agendamentos");
      return res.status(500).json({ error: "Falha ao buscar agendamentos" });
    }
  }
);

appointmentsRoutes.get(
  "/appointments/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const currentUserId = req.query.userId as string | undefined;

    logger.info({ params: req.params, query: req.query }, "Requisição GET /appointments/:id");

    if (!currentUserId) {
      logger.warn("ID do usuário não fornecido");
      return res
        .status(400)
        .json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

    if (!id) {
      logger.warn("ID do agendamento não fornecido");
      return res.status(400).json({ error: "ID do agendamento é obrigatório" });
    }

    try {
      const [appointment] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, id))
        .execute();

      if (!appointment) {
        logger.warn({ id }, "Agendamento não encontrado");
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }

      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, currentUserId))
        .execute();

      if (!currentUser) {
        logger.warn({ currentUserId }, "Usuário atual não encontrado");
        return res.status(404).json({ error: "Usuário atual não encontrado" });
      }

      if (
        currentUser.role !== "Admin" &&
        appointment.clientId !== currentUserId &&
        appointment.stylistId !== currentUserId
      ) {
        logger.warn(
          { currentUserId, appointment },
          "Usuário não tem permissão para acessar este agendamento"
        );
        return res
          .status(403)
          .json({ error: "Você não tem permissão para acessar este agendamento" });
      }

      logger.info({ appointment }, "Agendamento recuperado com sucesso");
      return res.status(200).json({
        message: "Agendamento resgatado com sucesso",
        appointment,
      });
    } catch (error) {
      logger.error({ error }, "Erro ao buscar agendamento");
      return res.status(500).json({ error: "Falha ao buscar agendamento" });
    }
  }
);

appointmentsRoutes.put(
  "/appointments/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const currentUserId = req.query.userId as string | undefined;

    logger.info(
      { body: req.body, params: req.params, query: req.query },
      "Requisição PUT /appointments/:id"
    );

    if (!currentUserId) {
      logger.warn("ID do usuário não fornecido");
      return res
        .status(400)
        .json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

    if (!id) {
      logger.warn("ID do agendamento não fornecido");
      return res.status(400).json({ error: "ID do agendamento é obrigatório" });
    }

    const result = insertAppointmentSchema.partial().safeParse({
      ...req.body,
      scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined,
    });

    if (!result.success) {
      logger.warn(
        { errors: result.error.errors },
        "Validação falhou no PUT /appointments/:id"
      );
      return res.status(400).json({
        error: "Validação falhou",
        details: result.error.errors,
      });
    }

    const updateData = result.data;

    try {
      const [existingAppointment] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, id))
        .execute();

      if (!existingAppointment) {
        logger.warn({ id }, "Agendamento não encontrado para atualização");
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }

      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, currentUserId))
        .execute();

      if (!currentUser) {
        logger.warn({ currentUserId }, "Usuário atual não encontrado");
        return res.status(404).json({ error: "Usuário atual não encontrado" });
      }

      if (
        currentUser.role !== "Admin" &&
        existingAppointment.clientId !== currentUserId &&
        existingAppointment.stylistId !== currentUserId
      ) {
        logger.warn(
          { currentUserId, appointment: existingAppointment },
          "Usuário não tem permissão para atualizar este agendamento"
        );
        return res
          .status(403)
          .json({ error: "Você não tem permissão para atualizar este agendamento" });
      }

      if (updateData.clientId) {
        const [client] = await db
          .select()
          .from(users)
          .where(eq(users.id, updateData.clientId))
          .execute();
        if (!client) {
          logger.warn({ clientId: updateData.clientId }, "Cliente não encontrado");
          return res.status(400).json({ error: "Cliente inválido" });
        }
      }

      if (updateData.stylistId) {
        const [stylist] = await db
          .select()
          .from(users)
          .where(eq(users.id, updateData.stylistId))
          .execute();
        if (!stylist) {
          logger.warn({ stylistId: updateData.stylistId }, "Estilista não encontrado");
          return res.status(400).json({ error: "Estilista inválido" });
        }
      }

      if (updateData.serviceId) {
        const [service] = await db
          .select()
          .from(services)
          .where(eq(services.id, updateData.serviceId))
          .execute();
        if (!service) {
          logger.warn({ serviceId: updateData.serviceId }, "Serviço não encontrado");
          return res.status(400).json({ error: "Serviço inválido" });
        }
      }

      const updatedFields: Partial<typeof appointments.$inferInsert> = {};
      if (updateData.clientId) updatedFields.clientId = updateData.clientId;
      if (updateData.stylistId) updatedFields.stylistId = updateData.stylistId;
      if (updateData.serviceId) updatedFields.serviceId = updateData.serviceId;
      if (updateData.scheduledAt) updatedFields.scheduledAt = updateData.scheduledAt;
      if (updateData.status) updatedFields.status = updateData.status;

      const [updatedAppointment] = await db
        .update(appointments)
        .set(updatedFields)
        .where(eq(appointments.id, id))
        .returning();

      logger.info({ updatedAppointment }, "Agendamento atualizado com sucesso");
      return res.status(200).json({
        message: "Agendamento atualizado com sucesso",
        appointment: updatedAppointment,
      });
    } catch (error) {
      logger.error({ error }, "Erro ao atualizar agendamento");
      return res.status(500).json({ error: "Falha ao atualizar agendamento" });
    }
  }
);

  appointmentsRoutes.delete(
  "/appointments/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const currentUserId = req.query.userId as string | undefined;

    logger.info(
      { params: req.params, query: req.query },
      "Requisição DELETE /appointments/:id"
    );

    if (!currentUserId) {
      logger.warn("ID do usuário não fornecido");
      return res
        .status(400)
        .json({ error: "ID do usuário é obrigatório (forneça userId na query)" });
    }

    if (!id) {
      logger.warn("ID do agendamento não fornecido");
      return res.status(400).json({ error: "ID do agendamento é obrigatório" });
    }

    try {
      const [appointment] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, id))
        .execute();

      if (!appointment) {
        logger.warn({ id }, "Agendamento não encontrado para deleção");
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }

      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, currentUserId))
        .execute();

      if (!currentUser) {
        logger.warn({ currentUserId }, "Usuário atual não encontrado");
        return res.status(404).json({ error: "Usuário atual não encontrado" });
      }

      if (
        currentUser.role !== "Admin" &&
        appointment.clientId !== currentUserId &&
        appointment.stylistId !== currentUserId
      ) {
        logger.warn(
          { currentUserId, appointment },
          "Usuário não tem permissão para deletar este agendamento"
        );
        return res
          .status(403)
          .json({ error: "Você não tem permissão para deletar este agendamento" });
      }

      await db.delete(appointments).where(eq(appointments.id, id)).execute();

      logger.info({ id }, "Agendamento deletado com sucesso");
      return res.status(200).json({
        message: "Agendamento deletado com sucesso",
      });
    } catch (error) {
      logger.error({ error }, "Erro ao deletar agendamento");
      return res.status(500).json({ error: "Falha ao deletar agendamento" });
    }
  }
);

export default appointmentsRoutes;