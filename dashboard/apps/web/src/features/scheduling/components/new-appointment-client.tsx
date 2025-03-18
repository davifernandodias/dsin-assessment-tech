"use client";

import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createAppointment } from "../actions";
import { toast, Toaster } from "sonner"; 
interface Service {
  id: string;
  typeId: string;
  description: string;
  price: string;
  durationMinutes: number;
  createdAt: string;
}

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

interface NewAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  userId: string;
  userData: any;
  onAppointmentCreated: (newAppointment: Appointment) => void;
}

export default function NewAppointmentForm({
  isOpen,
  onClose,
  services,
  userId,
  userData,
  onAppointmentCreated,
}: NewAppointmentFormProps) {
  const [formData, setFormData] = useState({
    clientName: userData.name,
    clientPhone: userData.phone,
    serviceId: "",
    scheduledAt: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>("08:00");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!formData.clientName) {
      toast.error("O nome do cliente é obrigatório.", { position: "top-center" });
      return false;
    }
    if (!formData.clientPhone) {
      toast.error("O telefone é obrigatório.", { position: "top-center" });
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
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData((prev) => ({ ...prev, serviceId }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      if (date < currentDate) {
        toast.error("A data selecionada não pode ser no passado.");
        return;
      }
  
      setSelectedDate(date);
  
      if (selectedHour) {
        const [hours, minutes] = selectedHour.split(":").map(Number);
        const updatedDate = setMinutes(setHours(date, hours!), minutes!);
        setFormData((prev) => ({ ...prev, scheduledAt: updatedDate.toISOString() }));
      }
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; 
    }

    setIsLoading(true);
    setError(null);

    try {
      const newAppointment = {
        clientId: userId,
        serviceId: formData.serviceId,
        scheduledAt: formData.scheduledAt,
        status: "pending",
        clientName: formData.clientName,
        clientPhone: formData.clientPhone || null,
      };
      const result = await createAppointment(userId, newAppointment);
      onAppointmentCreated(result);
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao criar agendamento. Tente novamente."
      );
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao criar agendamento. Tente novamente.",
        { position: "top-center" }
      );
      console.error("Erro ao criar agendamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableHours = Array.from({ length: 13 }, (_, i) =>
    `${String(8 + i).padStart(2, "0")}:00`
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-[800px] rounded-lg bg-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-violet-800">
              Novo Agendamento
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-sm sm:text-base">
                Seu Nome
              </Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                disabled={true}
                className="w-full text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="text-sm sm:text-base">
                Telefone
              </Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Serviço</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    {services.find((s) => s.id === formData.serviceId)?.description ||
                      "Selecione um serviço"}
                    <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-[700px] overflow-y-auto">
                  {services.map((service) => (
                    <DropdownMenuItem
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="text-sm sm:text-base"
                    >
                      {service.description}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Data e Hora</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  locale={ptBR}
                  className="rounded-md cursor-pointer border w-full sm:w-auto"
                  disabled={isLoading}
                  classNames={{
                    months: "w-full",
                    month: "w-full",
                    table: "w-full",
                    head_row: "flex w-full justify-between",
                    row: "flex w-full cursor-pointer justify-between",
                    cell: "w-[14%] cursor-pointer sm:w-10 text-center",
                    day: "w-full cursor-pointer hover:bg-gray-200 h-8 sm:h-10 rounded-md",
                  }}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-40 justify-between text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {selectedHour || "Selecione um horário"}
                      <span className="ml-2">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-[200px] overflow-y-auto">
                    {availableHours.map((hour) => (
                      <DropdownMenuItem
                        key={hour}
                        onClick={() => handleHourSelect(hour)}
                        className="text-sm sm:text-base"
                      >
                        {hour}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-violet-600 hover:bg-violet- Technologies700"
              disabled={isLoading}
            >
              {isLoading ? "Agendando..." : "Agendar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}