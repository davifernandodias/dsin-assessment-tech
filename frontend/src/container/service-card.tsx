
import { motion } from "framer-motion";
import { CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AppointmentCardProps {
  title: string;
  price: string;
  duration: string;
  image: string
}

export default function ServicesAppointment({
  title,
  price,
  duration,
  image,
}: AppointmentCardProps) {



  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className="overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
        <CardContent className="p-6">
          <motion.h3
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-1 text-xl font-semibold"
          >
            <span className="text-gray-700">Profissional, </span>
            <span className="text-blue-800">{title}.</span>
          </motion.h3>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4"
          >
            <p className="font-medium text-gray-700">Serviço agendado:</p>
            <p className="text-gray-600">{price}</p>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <p className="font-medium text-gray-700">Descrição:</p>
            <p className="text-gray-600">{duration}</p>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4"
          >
            <div className="h-2 w-full rounded-full bg-gray-200">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
                initial={{ width: "0%" }}
                animate={{ width: `${image}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <div className="mt-1 flex justify-end">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-xs text-gray-500"
                >
                  {image}%
                </motion.span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 flex items-center gap-6"
          >
            <div className="flex items-center text-gray-600">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-blue-500" />
              </motion.div>
              <span>{image}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
              </motion.div>
              <span>{image}</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
