import { eq } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
export default eq;

export const users = pgTable("users", {
  id: text().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  role: text("role").default("Client"), // Admin, Client
  phone: text("phone").unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const serviceTypes = pgTable("service_types", {
  id: text().primaryKey(),
  name: text("name").notNull().unique(),
});

export const services = pgTable("services", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  typeId: text("type_id")
    .notNull()
    .references(() => serviceTypes.id, { onDelete: "restrict" }),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  clientId: text("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "restrict" }),
  scheduledAt: timestamp("scheduled_at", { mode: "date" }).notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const insertUserSchema = createInsertSchema(users, {
  id: z.string(),
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
  role: z.string().optional(),
});

export const selectUserSchema = createSelectSchema(users);

export const insertServiceTypeSchema = createInsertSchema(serviceTypes, {
  id: z.string(),
  name: z.string().min(2, "Nome do tipo de serviço deve ter pelo menos 2 caracteres"),
});

export const selectServiceTypeSchema = createSelectSchema(serviceTypes);

export const insertServiceSchema = createInsertSchema(services, {
  typeId: z.string(),
  durationMinutes: z.number(),
});

export const selectServiceSchema = createSelectSchema(services);

export const insertAppointmentSchema = createInsertSchema(appointments, {
  clientId: z.string(),
  serviceId: z.string(),
  scheduledAt: z.date(),
});

export type User = typeof users.$inferSelect;
export type ServiceType = typeof serviceTypes.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
