"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppointmentCard from "@/container/appointment-card";
import Loading from "@/components/loading";
import Header from "@/components/header";
import WelcomeCard from "@/container/welcome-card";
import { servicesArrayMock } from "@mock/services";
import Appointment from "@/container/appointment";
import NavBottomBar from "@/components/nav-bottom-bar";
import ServicesAppointment from "@/container/service-card";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fake request in api
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-sky-50">
      <Header />

      <main className="container flex-1 px-4 py-6">
        <WelcomeCard />

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Próximo Agendamento
          </h2>
          <AppointmentCard
            clientName="Sabrina"
            professionalName="João"
            service="Corte e Coloração"
            description="Corte de cabelo e pintura loiro"
            date="15 Mar, 2023"
            time="10:30"
            progress={98}
          />
        </motion.section>

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Serviços Populares
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="text-sm text-blue-600">
                Ver todos
              </Button>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {servicesArrayMock.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <ServicesAppointment
                  title={service.title}
                  price={service.price}
                  duration={service.duration}
                  image={service.image}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Appointments List */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Agendamentos
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-blue-200 text-sm text-blue-600"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Calendário
              </Button>
            </motion.div>
          </div>
          <Appointment />
        </motion.section>
      </main>

      <NavBottomBar />
    </div>
  );
}
