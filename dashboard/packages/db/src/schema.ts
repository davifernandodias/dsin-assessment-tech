import { eq } from "drizzle-orm";
import { 
  pgEnum, 
  pgTable, 
  text, 
  timestamp,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
export default eq;

export const users = pgTable("users", {
  id: text().primaryKey(), 
  email: text().notNull().unique(),
  name: text().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text(),
});

export const rulesEnum = pgEnum("rules_enum", ["Admin", "Client", "Employee"]);

export const usersHasRules = pgTable("users_has_rules", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rule: rulesEnum("rule").notNull(),
  assignedAt: timestamp("assigned_at", { mode: "date" }).defaultNow(),
});

export const services = pgTable("services", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type_of_service").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  scheduledAt: timestamp("scheduled_at", { mode: "date" }),
  status: text("status").default("pending"),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});



export const insertUserSchema = createInsertSchema(users, {
  id: z.string(),
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  image: z.string().url("URL da imagem inválida").optional(),
  emailVerified: z.date().optional(),
});

export const selectUserSchema = createSelectSchema(users);

export const insertUserRuleSchema = createInsertSchema(usersHasRules, {
  userId: z.string(),
  rule: z.enum(["Admin", "Client", "Employee"]),
});

export const selectUserRuleSchema = createSelectSchema(usersHasRules);

export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);

export type User = typeof users.$inferSelect;
export type UserRule = typeof usersHasRules.$inferSelect;
export type Rule = "Admin" | "Client" | "Employee";
export type Service = typeof services.$inferSelect;