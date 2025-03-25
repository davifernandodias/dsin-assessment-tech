import express, { NextFunction, Request, Response, Router } from "express";
import logger from "../utils/logger";
import { db } from "@repo/db/client";
import { eq } from "@repo/db";
import { users, insertUserSchema } from "@repo/db/schema";

const usersRoutes = Router();

usersRoutes.post(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info({ body: req.body }, "Requisição POST /users");

    const result = insertUserSchema.safeParse(req.body);

    if (!result.success) {
      logger.warn({ errors: result.error.errors }, "Validação falhou no POST /users");
      return res.status(400).json({
        error: "Validação falhou",
        details: result.error.errors,
      });
    }

    const { id, email, name, role, phone } = result.data;

    const newUser = {
      id: id || crypto.randomUUID(), 
      email,
      name,
      role: role || "Client", 
      phone: phone || null,
      createdAt: new Date(),
    };

    try {
      const [insertedUser] = await db.insert(users).values(newUser).returning();

      logger.info({ user: insertedUser }, "Usuário criado com sucesso");
      return res.status(201).json({
        message: "Usuário criado com sucesso",
        user: insertedUser,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        if (error.message.includes("duplicate key")) {
          if (error.message.includes("users_pkey")) {
            logger.warn({ id }, "ID já está em uso");
            return res.status(409).json({ error: "ID já está em uso" });
          } else if (error.message.includes("email")) {
            logger.warn({ email }, "Email já está em uso");
            return res.status(409).json({ error: "Email já está em uso" });
          } else if (error.message.includes("phone")) {
            logger.warn({ phone }, "Número de telefone já está em uso");
            return res.status(409).json({ error: "Número de telefone já está em uso" });
          }
        }
      }
      
      logger.error({ error }, "Erro ao criar usuário");
      return res.status(500).json({ error: "Erro ao salvar usuário" });
    }
  }
);



usersRoutes.get(
  "/users",
  async (req: Request, res: Response, next: NextFunction) => {
    const initial = parseInt(req.query.initial as string);
    const limit = parseInt(req.query.limit as string);
    const currentUserId = req.query.userId as string | undefined;

    if (!currentUserId) {
      logger.warn("Id do usuário não informado");
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
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

      if (isNaN(initial) || isNaN(limit)) {
        logger.warn("Parâmetros 'initial' e 'limit' são obrigatórios e devem ser números");
        return res.status(400).json({
          error: "'initial' e 'limit' são obrigatórios e devem ser números",
        });
      }

      if (initial < 0 || limit < 0 || limit < initial) {
        logger.warn("Parâmetros inválidos de 'initial' e 'limit'");
        return res
          .status(400)
          .json({ error: "Parâmetros inválidos de 'initial' e 'limit'" });
      }

      let userList;

      if (currentUser.role === "Admin") {
        userList = await db
          .select()
          .from(users)
          .limit(limit - initial)
          .offset(initial)
          .execute();
      } else {
        userList = [currentUser];
      }

      logger.info({ users: userList }, "Usuários recuperados com sucesso");
      return res.status(200).json(userList);
    } catch (error) {
      logger.error({ error }, "Erro ao resgatar usuários");
      return res.status(500).json({ error: "Falha ao buscar usuários" });
    }
  }
);
usersRoutes.get(
  "/users/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    logger.info({ params: req.params }, "Requisição GET /users/:id");

    if (!id) {
      logger.warn("ID do usuário não fornecido");
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .execute();

      if (user.length === 0) {
        logger.warn({ id }, "Usuário não encontrado");
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      logger.info({ user: user[0] }, "Usuário recuperado com sucesso");
      return res.status(200).json({
        message: "Usuário resgatado com sucesso",
        user: user[0],
      });
    } catch (error) {
      logger.error({ error }, "Erro ao buscar usuário");
      return res.status(500).json({ error: "Falha ao buscar usuário" });
    }
  }
);

usersRoutes.put(
  "/users/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    logger.info(
      { body: req.body, params: req.params },
      "Requisição PUT /users/:id"
    );

    if (!id) {
      logger.warn("ID do usuário não fornecido");
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const result = insertUserSchema.partial().safeParse(req.body);

    if (!result.success) {
      logger.warn({ errors: result.error.errors }, "Validação falhou no PUT /users/:id");
      return res.status(400).json({
        error: "Validação falhou",
        details: result.error.errors,
      });
    }

    const updateData = result.data;

    try {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .execute();

      if (!existingUser) {
        logger.warn({ id }, "Usuário não encontrado para atualização");
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const updatedFields: Partial<typeof users.$inferInsert> = {};
      if (updateData.email) updatedFields.email = updateData.email;
      if (updateData.name) updatedFields.name = updateData.name;
      if (updateData.role) updatedFields.role = updateData.role;
      if (updateData.phone !== undefined) updatedFields.phone = updateData.phone;

      const [updatedUser] = await db
        .update(users)
        .set(updatedFields)
        .where(eq(users.id, id))
        .returning();

      logger.info({ updatedUser }, "Usuário atualizado com sucesso");
      return res.status(200).json({
        message: "Usuário atualizado com sucesso",
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        logger.warn({ email: updateData.email }, "Email já está em uso");
        return res.status(409).json({ error: "Email já está em uso" });
      }
      logger.error({ error }, "Erro ao atualizar usuário");
      return res.status(500).json({ error: "Falha ao atualizar usuário" });
    }
  }
);

usersRoutes.delete(
  "/users/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    logger.info({ params: req.params }, "Requisição DELETE /users/:id");

    if (!id) {
      logger.warn("ID do usuário não fornecido");
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .execute();

      if (!user) {
        logger.warn({ id }, "Usuário não encontrado para deleção");
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      await db.delete(users).where(eq(users.id, id)).execute();

      logger.info({ id }, "Usuário deletado com sucesso");
      return res.status(200).json({
        message: "Usuário deletado com sucesso",
      });
    } catch (error) {
      logger.error({ error }, "Erro ao deletar usuário");
      return res.status(500).json({ error: "Falha ao deletar usuário" });
    }
  }
);

export default usersRoutes;