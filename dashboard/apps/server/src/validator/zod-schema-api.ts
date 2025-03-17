import { z } from "zod";

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string().min(1),
  description: z.string().max(255).optional(),
  price: z
    .number()
    .min(0)
    .max(9999999999.99)
    .refine((val) => Number(val.toFixed(2)) === val),
  scheduledAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .optional(),
  status: z.enum(["pending", "completed", "canceled"]).default("pending"),
  createdBy: z.string().uuid(),
  userId: z.string().uuid().optional(),
  createdAt: z.string().optional(),
});

export default serviceSchema;
