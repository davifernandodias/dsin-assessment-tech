import { Button } from "@/components/ui/button";
import { appointmentsMock } from "@mock/appointments";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Menu } from "lucide-react";

export default function Appointment() {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {appointmentsMock.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-800">
                {appointment.name}
              </h3>
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {appointment.description}
            </p>
            <div className="mt-4 flex items-center rounded-lg bg-gray-50 p-2">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{appointment.time}</span>
              <motion.span
                className={`ml-auto text-sm font-medium ${appointment.statusColor} flex items-center`}
                animate={{
                  scale: appointment.status === "Pendente" ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  repeat:
                    appointment.status === "Pendente"
                      ? Number.POSITIVE_INFINITY
                      : 0,
                  repeatType: "reverse",
                  duration: 1.5,
                }}
              >
                {appointment.status}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
