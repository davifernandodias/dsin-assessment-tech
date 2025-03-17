import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@repo/db/client";
import { insertUserRuleSchema, users, usersHasRules } from "@repo/db/schema";
import { eq } from "@repo/db";
import { insertUserSchema } from "@repo/db/schema"; // Importe o schema Zod

const verifyPayload = async (req: NextRequest) => {
  const payloadString = await req.text();
  const header = await headers();

  const svixHeaders = {
    "svix-id": header.get("svix-id")!,
    "svix-timestamp": header.get("svix-timestamp")!,
    "svix-signature": header.get("svix-signature")!,
  };

  const webhookSecret = process.env.SIGNING_SECRET;
  if (!webhookSecret) {
    throw new Error("SIGNING_SECRET is not defined");
  }
  const webhook = new Webhook(webhookSecret);
  return webhook.verify(payloadString, svixHeaders) as WebhookEvent;
};

export async function POST(req: NextRequest) {
  console.log("Webhook recebido em /api/auth/webhook");
  try {
    const payload: WebhookEvent = await verifyPayload(req);

    switch (payload.type) {
      case "user.created":
        await handleUserCreated(payload.data);
        break;
      case "user.updated":
        // Implementar atualização se necessário
        break;
      case "user.deleted":
        if (!payload.data.id) throw new Error("Missing user id");
        await handleUserDeleted(payload.data.id);
        break;
      default:
        console.log("Evento não tratado:", payload.type);
        break;
    }
    return NextResponse.json({ message: "Received" }, { status: 200 });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}

const handleUserCreated = async (data: UserJSON) => {
  console.log("Criando usuário no banco:", data.id);

  const userData = insertUserSchema.parse({
    id: data.id,
    email: data.email_addresses[0]?.email_address,
    name:
      data.username ??
      `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
    image: data.image_url,
  });

  await db.insert(users).values(userData);

  const userRuleData = insertUserRuleSchema.parse({
    userId: data.id,
    rule: "Client",
  });

  await db.insert(usersHasRules).values(userRuleData);
};

const handleUserDeleted = async (userId: string) => {
  console.log("Deletando usuário:", userId);
  await db.delete(users).where(eq(users.id, userId));
};
