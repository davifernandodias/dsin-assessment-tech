import "dotenv/config"; 
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import { errorHandler } from "./utils/error-handler";
import logger from "./utils/logger";
import servicesRoutes from "./routes/services-routes";
import usersRoutes from "./routes/users-routes";
import appointmentsRoutes from "./routes/appointments-routes";

const app = express();

if (!process.env.API_URL_FRONTEND_LOCAL) {
  throw new Error("Missing API_URL_FRONTEND_LOCAL environment variable!");
}
if (!process.env.API_PORT) {
  throw new Error("Missing API_PORT environment variable!");
}

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use("/api", servicesRoutes);
app.use("/api", usersRoutes);
app.use("/api", appointmentsRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err }, "Erro capturado no middleware");
  errorHandler.handle(err, res);
});

const server = createServer(app);

server.listen(process.env.API_PORT, () => {
  logger.info("Servidor iniciado na porta " + process.env.API_PORT);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error({ promise, reason }, "Unhandled Rejection");
});

process.on("uncaughtException", (error) => {
  logger.error({ error }, "Uncaught Exception");
  server.close(() => {
    logger.info("Server closed");
    process.exit(1);
  });
});

export { server, app };