"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { dates, servicesArrayMockAgenda, times } from "@mock/services";

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab, setActiveTab] = useState("service");



  const handleContinue = () => {
    if (activeTab === "service" && selectedService) {
      setActiveTab("date");
    } else if (activeTab === "date" && selectedDate && selectedTime) {
      setActiveTab("confirm");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-sky-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-white/80 shadow-sm backdrop-blur-md"
      >
        <div className="container flex items-center p-4">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <h1 className="text-xl font-semibold text-gray-800">
            Agendar Serviço
          </h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="service">
              Serviço
              {selectedService && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 text-green-500"
                >
                  <CheckCircle className="h-4 w-4" />
                </motion.div>
              )}
            </TabsTrigger>
            <TabsTrigger value="date">
              Data
              {selectedDate && selectedTime && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 text-green-500"
                >
                  <CheckCircle className="h-4 w-4" />
                </motion.div>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirm">Confirmar</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="service">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="mb-4 text-lg font-medium text-gray-800">
                  Escolha um serviço
                </h2>

                <RadioGroup
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  {servicesArrayMockAgenda.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`mb-3 cursor-pointer transition-all ${selectedService === service.id ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                      >
                        <CardContent className="p-4">
                          <RadioGroupItem
                            value={service.id}
                            id={service.id}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={service.id}
                            className="flex cursor-pointer items-center justify-between"
                          >
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {service.name}
                              </h3>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{service.duration}</span>
                              </div>
                            </div>
                            <span className="font-semibold text-blue-600">
                              {service.price}
                            </span>
                          </Label>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </RadioGroup>

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-500"
                      disabled={!selectedService}
                      onClick={handleContinue}
                    >
                      Continuar
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="date">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-800">
                    Escolha uma data
                  </h2>
                  <div className="grid grid-cols-4 gap-2">
                    {dates.map((date, index) => (
                      <motion.button
                        key={date.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex flex-col items-center rounded-lg p-3 transition-all ${
                          selectedDate === date.id
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedDate(date.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-sm">{date.display}</span>
                        <span
                          className={`mt-1 text-xs ${selectedDate === date.id ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {date.date}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-lg font-medium text-gray-800">
                    Escolha um horário
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {times.map((time, index) => (
                      <motion.button
                        key={time.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`flex items-center justify-center rounded-lg p-3 transition-all ${
                          selectedTime === time.id
                            ? "bg-blue-600 text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                        }`}
                        onClick={() => setSelectedTime(time.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Clock
                          className={`mr-1 h-3 w-3 ${selectedTime === time.id ? "text-white" : "text-gray-500"}`}
                        />
                        <span>{time.time}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-500"
                      disabled={!selectedDate || !selectedTime}
                      onClick={handleContinue}
                    >
                      Continuar
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="confirm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="mb-4 text-lg font-medium text-gray-800">
                  Confirme seu agendamento
                </h2>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <h3 className="text-sm font-medium text-gray-500">
                            Serviço
                          </h3>
                          <p className="font-medium text-gray-800">
                            Corte de Cabelo
                          </p>
                          <p className="font-semibold text-blue-600">R$ 80</p>
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex gap-6"
                        >
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              Data
                            </h3>
                            <div className="mt-1 flex items-center">
                              <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                              <span>15 Mar, 2023</span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              Horário
                            </h3>
                            <div className="mt-1 flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-blue-500" />
                              <span>10:30</span>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="text-sm font-medium text-gray-500">
                            Profissional
                          </h3>
                          <p className="font-medium text-gray-800">Sabrina</p>
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <h3 className="text-sm font-medium text-gray-500">
                            Observações
                          </h3>
                          <textarea
                            className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Adicione instruções especiais aqui..."
                            rows={3}
                          />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-500">
                      Confirmar Agendamento
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
}
