import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export default function WelcomeCard() {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white shadow-lg"
      >
        <h2 className="mb-1 text-xl font-medium">Olá, Bruna</h2>
        <p className="mb-4 text-white/80">
          Bem-vinda de volta ao seu painel de agendamentos
        </p>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          <span className="text-sm">
            Hoje:{" "}
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </motion.div>
    </motion.section>
  );
}
