import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey(),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
});


export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
