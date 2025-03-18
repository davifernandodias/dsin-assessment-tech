"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, Filter, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import CardDataInformation from "../components/card-data-information";
import DetailScheduleForm from "../components/detail-schedule-form";
import NewServiceForm from "../components/new-service-form";
import DetailServiceForm from "../components/detail-service-form";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
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

interface DataInformation {
  appintmentsInformation: Appointment[];
  servicesInformation: Service[];
}

export default function ScheduleAdminPanel({
  DataInformation,
  userId,
}: {
  DataInformation: DataInformation;
  userId: string;
}) {
  const [activeTab, setActiveTab] = useState("agendamentos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [isDetailServiceModalOpen, setIsDetailServiceModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(DataInformation.appintmentsInformation);
  const [services, setServices] = useState<Service[]>(DataInformation.servicesInformation);

  useEffect(() => {
    setAppointments(DataInformation.appintmentsInformation);
    setServices(DataInformation.servicesInformation);
  }, [DataInformation.appintmentsInformation, DataInformation.servicesInformation]);

  const getStatusBadge = (status: string = "pendente") => {
    const statusMap: { [key: string]: string } = {
      pending: "pendente",
      confirmed: "confirmado",
      canceled: "cancelado",
      active: "ativo",
    };
    const translatedStatus = statusMap[status.toLowerCase()] || status.toLowerCase();
    const variants = {
      confirmado: "bg-green-500 hover:bg-green-600",
      pendente: "bg-amber-500 hover:bg-amber-600",
      cancelado: "bg-rose-500 hover:bg-rose-600",
      ativo: "bg-violet-500 hover:bg-violet-600",
    };
    return (
      <Badge
        className={variants[translatedStatus as keyof typeof variants] || "bg-gray-500"}
      >
        {translatedStatus.charAt(0).toUpperCase() + translatedStatus.slice(1)}
      </Badge>
    );
  };

  const uniqueAppointments = Array.from(
    new Map(appointments.map((appointment) => [appointment.id, appointment])).values()
  );

  const filteredAppointments = uniqueAppointments.filter((appointment) => {
    const service = services.find((s) => s.id === appointment.serviceId);
    const matchesSearch =
      (service?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ?? false;
    const matchesDate = selectedDate
      ? isSameDay(new Date(appointment.scheduledAt), selectedDate)
      : true;
    const isValidStatus = ["confirmed", "pending", "finished"].includes(
      appointment.status.toLowerCase()
    );
    return matchesSearch && matchesDate && isValidStatus;
  });

  const filteredServices = services.filter(
    (service) =>
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.typeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scheduledDates = uniqueAppointments.map((a) => new Date(a.scheduledAt).toDateString());

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

  const handleServiceRowClick = (service: Service) => {
    setSelectedService(service);
    setIsDetailServiceModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleCloseDetailServiceModal = () => {
    setIsDetailServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleConfirm = (id: string) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status: "confirmed" } : appt))
    );
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

  const handleServiceCreated = (newService: Service) => {
    setServices((prev) => [...prev, newService]);
    setIsNewServiceModalOpen(false);
  };

  const handleServiceUpdated = (updatedService: Service) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    setIsDetailServiceModalOpen(false);
  };

  const handleServiceDeleted = (serviceId: string) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId));
    setIsDetailServiceModalOpen(false);
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
            Painel Administrativo
          </h1>
          <p className="text-sm text-slate-500 sm:text-base">
            Gerencie todos os agendamentos e serviços.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div className="md:col-span-2" variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 bg-violet-100">
              <TabsTrigger
                value="agendamentos"
                className="cursor-pointer transition-all duration-200 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                Agendamentos ({uniqueAppointments.length})
              </TabsTrigger>
              <TabsTrigger
                value="servicos"
                className="cursor-pointer transition-all duration-200 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                Serviços ({services.length})
              </TabsTrigger>
            </TabsList>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <CardDataInformation
                DataInformation={{ appintmentsInformation: appointments, servicesInformation: services }}
              />
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="agendamentos" asChild>
                <motion.div
                  key="agendamentos"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        placeholder="Buscar por cliente ou serviço..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-xs border-violet-200 transition-all duration-200 focus-visible:ring-violet-500 sm:w-auto"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-violet-200 hover:bg-violet-50"
                          >
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Todos</DropdownMenuItem>
                          <DropdownMenuItem>Confirmados</DropdownMenuItem>
                          <DropdownMenuItem>Pendentes</DropdownMenuItem>
                          <DropdownMenuItem>Cancelados</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

                  <Card className="overflow-x-auto border-violet-100 p-0 shadow-sm">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-violet-50">
                          <TableRow>
                            <TableHead className="min-w-[120px]">Nome</TableHead>
                            <TableHead className="min-w-[150px]">Descrição</TableHead>
                            <TableHead className="min-w-[150px]">Data</TableHead>
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
                                <TableCell>{appointment.clientName}</TableCell>
                                <TableCell>
                                  {(service?.description.slice(0, 16) || "Serviço não encontrado") + "..."}
                                </TableCell>
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
                              <TableCell colSpan={5} className="py-8 text-center">
                                <p className="text-slate-500">
                                  {selectedDate
                                    ? "Nenhum agendamento para esta data"
                                    : "Nenhum agendamento encontrado"}
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
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Input
                      placeholder="Buscar serviços..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full max-w-xs border-violet-200 focus-visible:ring-violet-500 sm:w-auto"
                    />
                    <Button
                      onClick={() => setIsNewServiceModalOpen(true)}
                      className="w-full bg-violet-600 hover:bg-violet-700 sm:w-auto"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Serviço
                    </Button>
                  </div>

                  <Card className="overflow-x-auto border-violet-100 p-0 shadow-sm">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-violet-50">
                          <TableRow>
                            <TableHead className="min-w-[120px]">Tipo</TableHead>
                            <TableHead className="min-w-[100px]">Preço</TableHead>
                            <TableHead className="min-w-[150px]">Descrição</TableHead>
                            <TableHead className="min-w-[100px]">Duração</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredServices.map((service) => (
                            <TableRow
                              key={service.id}
                              onClick={() => handleServiceRowClick(service)}
                              className="cursor-pointer hover:bg-violet-50"
                            >
                              <TableCell>{service.typeId}</TableCell>
                              <TableCell>
                                {Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(Number(service.price))}
                              </TableCell>
                              <TableCell>{service.description}</TableCell>
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
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1 p-0 hidden lg:flex">
          <Card className="flex justify-center border-violet-100 p-0 shadow-sm">
            <CardHeader className="border-b border-violet-100 bg-violet-50 py-12">
              <CardTitle className="text-lg text-violet-800 sm:text-xl">Calendário</CardTitle>
              <CardDescription className="text-sm">
                Visualize todos os agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={ptBR}
                className="w-full flex justify-center cursor-pointer  rounded-md border-violet-100 text-sm sm:text-base"
                modifiers={{
                  booked: (date) => scheduledDates.includes(date.toDateString()),
                }}
                modifiersClassNames={{
                  booked: "bg-violet-200",
                }}
                classNames={{
                  months: "space-y-2",
                  month: "space-y-2",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-muted-foreground  cursor-pointer rounded-md w-8 font-normal text-[0.875rem] sm:w-10 sm:text-[1rem]",
                  row: "flex w-full mt-1",
                  cell: "h-8 w-8 text-center  text-sm p-0 relative rounded-md sm:h-10 sm:w-10",
                  day: "h-8 w-8 p-0 font-normal cursor-pointer  aria-selected:bg-violet-100 aria-selected:text-violet-900 sm:h-10 sm:w-10",
                  day_selected: "bg-violet-600  cursor-pointer text-white hover:bg-violet-700",
                  day_today: "border-2 border-violet-500",
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {selectedAppointment && (
        <DetailScheduleForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          appointment={selectedAppointment}
          service={services.find((s) => s.id === selectedAppointment.serviceId) || null}
          services={services}
          userId={userId}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onUpdate={handleUpdate}
        />
      )}

      <NewServiceForm
        isOpen={isNewServiceModalOpen}
        onClose={() => setIsNewServiceModalOpen(false)}
        userId={userId}
        onServiceCreated={handleServiceCreated}
      />

      {selectedService && (
        <DetailServiceForm
          isOpen={isDetailServiceModalOpen}
          onClose={handleCloseDetailServiceModal}
          service={selectedService}
          userId={userId}
          onServiceUpdated={handleServiceUpdated}
          onServiceDeleted={handleServiceDeleted}
        />
      )}
    </motion.div>
  );
}