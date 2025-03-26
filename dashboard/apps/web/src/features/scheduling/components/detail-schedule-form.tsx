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
import { Appointment, Service } from "@/@types/services";

interface DetailScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  service: Service | null;
  services: Service[];
  userId: string;
  role: string;
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
  role,
  onConfirm,
  onCancel,
  onUpdate,
}: DetailScheduleFormProps) {
  const isAdmin = role === "Admin";
  const isClient = role === "Client";
  const initialScheduledAt = appointment ? new Date(appointment.scheduledAt) : undefined;

  const [formData, setFormData] = useState<Partial<Appointment>>({
    clientName: appointment?.clientName || "",
    scheduledAt: appointment?.scheduledAt || "",
    serviceId: appointment?.serviceId || "",
    clientPhone: isAdmin ? appointment?.clientPhone || "" : undefined,
    status: isAdmin ? appointment?.status || "" : "pending",
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialScheduledAt);
  const [selectedHour, setSelectedHour] = useState<string>(
    initialScheduledAt ? format(initialScheduledAt, "HH:mm") : "08:00"
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canClientEdit = isClient && appointment
    ? differenceInDays(new Date(appointment.scheduledAt), new Date()) > 2
    : true;

  useEffect(() => {
    setFormData({
      clientName: appointment?.clientName || "",
      scheduledAt: appointment?.scheduledAt || "",
      serviceId: appointment?.serviceId || "",
      clientPhone: isAdmin ? appointment?.clientPhone || "" : undefined,
      status: isAdmin ? appointment?.status || "" : "pending",
    });
    setSelectedDate(initialScheduledAt);
    setSelectedHour(initialScheduledAt ? format(initialScheduledAt, "HH:mm") : "08:00");
  }, [appointment, isAdmin]);

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

    if (isClient && !canClientEdit) {
      toast.error(
        "Não é possível atualizar, pois o agendamento está muito próximo. Poderia reagendar se a data fosse maior que dois dias. Entre em contato com a dona (16) 98845-3464.",
        { duration: 10000, position: "top-right" }
      );
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedData: Partial<Appointment> = {
        clientName: formData.clientName,
        serviceId: formData.serviceId,
        scheduledAt: formData.scheduledAt,
        ...(isAdmin && { clientPhone: formData.clientPhone }),
        ...(isAdmin && { status: formData.status }),
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

  const handleFinishAction = async () => {
    if (!appointment?.id || !isAdmin) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedData: Partial<Appointment> = {
        status: "finished",
      };

      await updateStatusSchedule(appointment.id, userId, updatedData);
      onUpdate(appointment.id, updatedData);
      onConfirm(appointment.id);
      toast.success("Agendamento finalizado com sucesso.", { position: "top-center" });
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao finalizar o agendamento. Tente novamente."
      );
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao finalizar o agendamento. Tente novamente.",
        { position: "top-center" }
      );
      console.error("Erro ao finalizar o agendamento:", error);
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
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[700px] rounded-lg bg-white shadow-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center sm:text-left">
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6 py-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {appointment && service ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700">
                  {isAdmin ? "Nome do Cliente" : "Meu Nome"}
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName || ""}
                  onChange={handleChange}
                  className="w-full border-violet-200 focus:ring-violet-500"
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
                    className="w-full border-violet-200 focus:ring-violet-500"
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
                      className="w-full justify-between border-violet-200 text-left hover:bg-violet-50 text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {currentService ? getServiceName(currentService) : "Selecione um serviço"}
                      <span className="ml-2">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                    {services.map((svc) => (
                      <DropdownMenuItem
                        key={svc.id}
                        onClick={() => handleServiceSelect(svc.id)}
                        className="cursor-pointer hover:bg-violet-100 text-sm sm:text-base"
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
                      className="flex items-center justify-between border border-violet-200 rounded-md px-3 py-2 hover:bg-violet-50 text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      <span>
                        {selectedDate
                          ? format(selectedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                          : "Selecione uma data e hora"}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 border border-t-0 border-violet-200 rounded-b-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          locale={ptBR}
                          className="rounded-md border-violet-100 w-full max-w-[300px] mx-auto sm:mx-0"
                          disabled={isLoading}
                        />
                        <div className="space-y-2 w-full max-w-[200px] mx-auto sm:mx-0">
                          <Label className="text-sm font-medium text-gray-700">Horário</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between border-violet-200 text-left hover:bg-violet-50 text-sm sm:text-base"
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
                                  className="cursor-pointer hover:bg-violet-100 text-sm sm:text-base"
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
                  className="w-full border-violet-200 bg-gray-100 text-sm sm:text-base"
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
                        className="w-full justify-between border-violet-200 text-left capitalize hover:bg-violet-50 text-sm sm:text-base"
                        disabled={isLoading}
                      >
                        {formData.status || "Selecione um status"}
                        <span className="ml-2">▼</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuItem
                        onClick={() => handleStatusSelect("confirmed")}
                        className="cursor-pointer hover:bg-violet-100 text-sm sm:text-base"
                      >
                        Confirmado
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusSelect("canceled")}
                        className="cursor-pointer hover:bg-violet-100 text-sm sm:text-base"
                      >
                        Cancelado
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusSelect("pending")}
                        className="cursor-pointer hover:bg-violet-100 text-sm sm:text-base"
                      >
                        Pendente
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusSelect("finished")}
                        className="cursor-pointer hover:bg-violet-100 text-sm sm:text-base"
                      >
                        Finalizado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center">Nenhum agendamento selecionado.</p>
          )}
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-4 sm:justify-end">
          {isAdmin ? (
            <>
              <Button
                onClick={handleConfirmAction}
                className="w-full bg-violet-600 hover:bg-violet-500 sm:w-auto text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? "Atualizando..." : "Confirmar"}
              </Button>
              <Button
                onClick={handleFinishAction}
                className="w-full bg-green-600 hover:bg-green-500 sm:w-auto text-sm sm:text-base"
                disabled={isLoading || formData.status === "finished"}
              >
                {isLoading ? "Finalizando..." : "Finalizar"}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleConfirmAction}
              className="w-full bg-violet-600 hover:bg-violet-500 sm:w-auto text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Atualizando..." : "Confirmar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}