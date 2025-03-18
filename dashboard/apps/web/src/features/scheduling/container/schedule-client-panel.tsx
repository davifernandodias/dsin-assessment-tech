"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import DetailScheduleForm from "../components/detail-schedule-form";
import NewAppointmentForm from "../components/new-appointment-client";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
  clientName: string;
  clientPhone: string | null;
}

interface Service {
  id: string;
  typeId: string;
  description: string;
  price: string;
  durationMinutes: number;
  createdAt: string;
}

interface ClientData {
  appointments: Appointment[];
  services: Service[];
}

export default function ClientSchedulePanel({
  clientData,
  userId,
  userData,
}: {
  clientData: ClientData;
  userId: string;
  userData: any;
}) {
  const isAdmin = userData?.role === "Admin";
  const [activeTab, setActiveTab] = useState("meus-agendamentos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(clientData.appointments);
  const [services] = useState<Service[]>(clientData.services);

  useEffect(() => {
    setAppointments(clientData.appointments);
  }, [clientData.appointments]);

  const getStatusBadge = (status: string = "pendente") => {
    const statusMap: { [key: string]: string } = {
      pending: "pendente",
      confirmed: "confirmado",
      canceled: "cancelado",
    };
    const translatedStatus = statusMap[status.toLowerCase()] || status.toLowerCase();
    const variants = {
      confirmado: "bg-green-500 hover:bg-green-600",
      pendente: "bg-amber-500 hover:bg-amber-600",
      cancelado: "bg-rose-500 hover:bg-rose-600",
    };
    return (
      <Badge className={variants[translatedStatus as keyof typeof variants] || "bg-gray-500"}>
        {translatedStatus.charAt(0).toUpperCase() + translatedStatus.slice(1)}
      </Badge>
    );
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const service = services.find((s) => s.id === appointment.serviceId);
    const matchesSearch =
      (service?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
    const matchesDate = selectedDate
      ? isSameDay(new Date(appointment.scheduledAt), selectedDate)
      : true;
    return matchesSearch && matchesDate && appointment.clientId === userId;
  });

  const filteredServices = services.filter((service) =>
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scheduledDates = appointments.map((a) => new Date(a.scheduledAt).toDateString());

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleCalendarReset = () => {
    setSelectedDate(undefined);
  };

  const handleRowClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleConfirm = (id: string) => {
    // Apenas admins podem confirmar o status como "confirmed" localmente
    if (isAdmin) {
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "confirmed" } : appt))
      );
    }
  };

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status: "canceled" } : appt))
    );
  };

  const handleUpdate = (id: string, updatedData: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, ...updatedData } : appt))
    );
  };

  const handleAppointmentCreated = (newAppointment: Appointment) => {
    setAppointments((prev) => [...prev, newAppointment]);
    setIsNewAppointmentModalOpen(false);
  };


  return (
    <motion.div
      className="container mx-auto space-y-6 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl font-bold text-violet-800 sm:text-3xl">
            Meu Painel de Agendamento
          </h1>
          <p className="text-sm text-slate-500 sm:text-base">
            Agende serviços e gerencie seus horários com facilidade.
          </p>
        </div>
        <Button
          onClick={() => setIsNewAppointmentModalOpen(true)}
          className="w-full bg-violet-600 hover:bg-violet-700 sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 bg-violet-100">
          <TabsTrigger
            value="meus-agendamentos"
            className="cursor-pointer transition-all duration-200 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            Meus Agendamentos ({filteredAppointments.length})
          </TabsTrigger>
          <TabsTrigger
            value="servicos"
            className="cursor-pointer transition-all duration-200 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            Serviços Disponíveis ({services.length})
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="meus-agendamentos" asChild>
            <motion.div
              key="meus-agendamentos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    placeholder="Buscar por serviço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-xs border-violet-200 transition-all duration-200 focus-visible:ring-violet-500 sm:w-auto"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`border-violet-200 hover:bg-violet-50 ${selectedDate ? "bg-violet-100" : ""}`}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          locale={ptBR}
                          className="rounded-md border"
                          modifiers={{
                            booked: (date) => scheduledDates.includes(date.toDateString()),
                          }}
                          modifiersClassNames={{
                            booked: "bg-violet-200",
                          }}
                        />
                        {selectedDate && (
                          <Button
                            variant="ghost"
                            className="mt-2 w-full text-sm text-violet-600 hover:bg-violet-50"
                            onClick={handleCalendarReset}
                          >
                            Limpar seleção
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Card className="overflow-x-auto border-violet-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-violet-800">Seus Agendamentos</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-violet-50">
                      <TableRow>
                        <TableHead className="min-w-[150px]">Serviço</TableHead>
                        <TableHead className="min-w-[150px]">Data e Hora</TableHead>
                        <TableHead className="min-w-[100px]">Preço</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => {
                        const service = services.find((s) => s.id === appointment.serviceId);
                        return (
                          <TableRow
                            key={appointment.id}
                            onClick={() => handleRowClick(appointment)}
                            className="cursor-pointer hover:bg-violet-50"
                          >
                            <TableCell>{service?.description || "Serviço não encontrado"}</TableCell>
                            <TableCell>
                              {format(new Date(appointment.scheduledAt), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                              })}
                            </TableCell>
                            <TableCell>
                              {service?.price
                                ? Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(Number(service.price))
                                : "N/A"}
                            </TableCell>
                            <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                          </TableRow>
                        );
                      })}
                      {filteredAppointments.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="py-8 text-center">
                            <p className="text-slate-500">
                              {selectedDate
                                ? "Nenhum agendamento para esta data"
                                : "Você ainda não tem agendamentos"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="servicos" asChild>
            <motion.div
              key="servicos"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Input
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-xs border-violet-200 focus-visible:ring-violet-500 sm:w-auto"
              />

              <Card className="overflow-x-auto border-violet-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-violet-800">Serviços Disponíveis</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-violet-50">
                      <TableRow>
                        <TableHead className="min-w-[150px]">Descrição</TableHead>
                        <TableHead className="min-w-[100px]">Preço</TableHead>
                        <TableHead className="min-w-[100px]">Duração</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((service) => (
                        <TableRow key={service.id} className="hover:bg-violet-50">
                          <TableCell>{service.description}</TableCell>
                          <TableCell>
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </TableCell>
                          <TableCell>{service.durationMinutes} min</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      {selectedAppointment && (
        <DetailScheduleForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          appointment={selectedAppointment}
          service={services.find((s) => s.id === selectedAppointment.serviceId) || null}
          services={services}
          userId={userId}
          userData={userData}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onUpdate={handleUpdate}
        />
      )}

      <NewAppointmentForm
        isOpen={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        services={services}
        userId={userId}
        userData={userData}
        onAppointmentCreated={handleAppointmentCreated}
      />
    </motion.div>
  );
}