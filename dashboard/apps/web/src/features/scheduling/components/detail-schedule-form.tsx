"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { format, setHours, setMinutes, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { updateStatusSchedule } from "../actions";
import { toast } from "sonner";

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

interface DetailScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  service: Service | null;
  services: Service[];
  userId: string;
  userData?: any;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onUpdate: (id: string, updatedData: Partial<Appointment>) => void;
}

export default function DetailScheduleForm({
  isOpen,
  onClose,
  appointment,
  service,
  services,
  userId,
  userData,
  onConfirm,
  onCancel,
  onUpdate,
}: DetailScheduleFormProps) {
  const isAdmin = userData?.role === "Admin";
  const isClint = userData?.role === "Client";
  const initialScheduledAt = appointment ? new Date(appointment.scheduledAt) : undefined;

  const [formData, setFormData] = useState<Partial<Appointment>>({
    clientName: appointment?.clientName || "",
    scheduledAt: appointment?.scheduledAt || "",
    status: appointment?.status || "",
    serviceId: appointment?.serviceId || "",
    clientPhone: appointment?.clientPhone || "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialScheduledAt);
  const [selectedHour, setSelectedHour] = useState<string>(
    initialScheduledAt ? format(initialScheduledAt, "HH:mm") : "08:00"
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canUserEdit = !isAdmin && appointment
    ? differenceInDays(new Date(appointment.scheduledAt), new Date()) > 2
    : true;

  useEffect(() => {}, [isAdmin, canUserEdit, isOpen, appointment]);

  const validateForm = () => {
    if (!formData.clientName) {
      toast.error("O nome do cliente é obrigatório.", { position: "top-center" });
      return false;
    }
    if (!formData.serviceId) {
      toast.error("Selecione um serviço.", { position: "top-center" });
      return false;
    }
    if (!formData.scheduledAt) {
      toast.error("A data e hora são obrigatórias.", { position: "top-center" });
      return false;
    }
    if (isAdmin && !formData.status) {
      toast.error("Selecione um status.", { position: "top-center" });
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusSelect = (status: string) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData((prev) => ({ ...prev, serviceId }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && selectedHour) {
      const [hours, minutes] = selectedHour.split(":").map(Number);
      const updatedDate = setMinutes(setHours(date, hours!), minutes!);
      setFormData((prev) => ({ ...prev, scheduledAt: updatedDate.toISOString() }));
    }
  };

  const handleHourSelect = (hour: string) => {
    setSelectedHour(hour);
    if (selectedDate) {
      const [hours, minutes] = hour.split(":").map(Number);
      const updatedDate = setMinutes(setHours(selectedDate, hours!), minutes!);
      setFormData((prev) => ({ ...prev, scheduledAt: updatedDate.toISOString() }));
    }
  };

  const handleConfirmAction = async () => {
    if (!appointment?.id) return;

    if (!isAdmin && !canUserEdit) {
      console.log(userData)
      console.log(isAdmin)
      toast.error(
        "Não é possível atualizar, pois o agendamento está muito próximo. Poderia reagendar se a data fosse maior que dois dias. Entre em contato com a dona (16) 98845-3464.",
        {
          duration: 10000,
          position: "top-right",
        }
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedData: Partial<Appointment> = {
        clientName: formData.clientName,
        serviceId: formData.serviceId,
        scheduledAt: formData.scheduledAt,
        clientPhone: formData.clientPhone,
        status: isAdmin ? formData.status : "pending", 
      };

      await updateStatusSchedule(appointment.id, userId, updatedData);
      onUpdate(appointment.id, updatedData);
      onConfirm(appointment.id);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar o agendamento. Tente novamente."
      );
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar o agendamento. Tente novamente.",
        { position: "top-center" }
      );
      console.error("Erro ao atualizar o agendamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceName = (service: Service) => {
    return service.typeId === "type-001"
      ? "Corte de Cabelo Masculino"
      : service.typeId === "type-002"
      ? "Corte de Cabelo Feminino"
      : service.typeId === "type-003"
      ? "Coloração Completa"
      : service.typeId === "type-004"
      ? "Mechas"
      : service.typeId === "type-005"
      ? "Escova Progressiva"
      : service.typeId;
  };

  const availableHours = Array.from({ length: 13 }, (_, i) =>
    `${String(8 + i).padStart(2, "0")}:00`
  );

  const currentService = services.find((s) => s.id === formData.serviceId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" >
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {appointment && service ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                  {isAdmin ? "Nome do Cliente" : "Meu Nome"}
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName || ""}
                  onChange={handleChange}
                  className="border-violet-200 focus:ring-violet-500"
                  disabled={!isAdmin || isLoading}
                />
              </div>
              {isAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="clientPhone" className="text-sm font-medium text-gray-700">
                    Telefone do Cliente
                  </Label>
                  <Input
                    id="clientPhone"
                    name="clientPhone"
                    value={formData.clientPhone || ""}
                    onChange={handleChange}
                    className="border-violet-200 focus:ring-violet-500"
                    disabled={isLoading}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-medium text-gray-700">
                  Serviço
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-violet-200 text-left hover:bg-violet-50"
                      disabled={isLoading}
                    >
                      {currentService ? getServiceName(currentService) : "Selecione um serviço"}
                      <span className="ml-2">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {services.map((svc) => (
                      <DropdownMenuItem
                        key={svc.id}
                        onClick={() => handleServiceSelect(svc.id)}
                        className="cursor-pointer hover:bg-violet-100"
                      >
                        {getServiceName(svc)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Data e Hora</Label>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="calendar">
                    <AccordionTrigger
                      className="flex items-center justify-between border border-violet-200 rounded-md px-3 py-2 hover:bg-violet-50"
                      disabled={isLoading}
                    >
                      <span>
                        {selectedDate
                          ? format(selectedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                          : "Selecione uma data e hora"}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 border border-t-0 border-violet-200 rounded-b-md">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          locale={ptBR}
                          className="rounded-md border-violet-100"
                          disabled={isLoading}
                        />
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Horário</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between border-violet-200 text-left hover:bg-violet-50"
                                disabled={isLoading}
                              >
                                {selectedHour || "Selecione um horário"}
                                <span className="ml-2">▼</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                              {availableHours.map((hour) => (
                                <DropdownMenuItem
                                  key={hour}
                                  onClick={() => handleHourSelect(hour)}
                                  className="cursor-pointer hover:bg-violet-100"
                                >
                                  {hour}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Preço
                </Label>
                <Input
                  id="price"
                  value={
                    currentService
                      ? Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(currentService.price))
                      : "N/A"
                  }
                  disabled
                  className="border-violet-200 bg-gray-100"
                />
              </div>
              {isAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between border-violet-200 text-left capitalize hover:bg-violet-50"
                        disabled={isLoading}
                      >
                        {formData.status || "Selecione um status"}
                        <span className="ml-2">▼</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem
                        onClick={() => handleStatusSelect("confirmed")}
                        className="cursor-pointer hover:bg-violet-100"
                      >
                        Confirmado
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusSelect("canceled")}
                        className="cursor-pointer hover:bg-violet-100"
                      >
                        Cancelado
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusSelect("pending")}
                        className="cursor-pointer hover:bg-violet-100"
                      >
                        Pendente
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusSelect("finished")}
                        className="cursor-pointer hover:bg-violet-100"
                      >
                        Finalizado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Nenhum agendamento selecionado.</p>
          )}
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button
            onClick={handleConfirmAction}
            className="w-full bg-violet-600 hover:bg-violet-500 sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? "Atualizando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}