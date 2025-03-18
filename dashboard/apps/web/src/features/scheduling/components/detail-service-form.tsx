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
import { updateService, deleteService } from "../actions";

interface Service {
  id: string;
  typeId: string;
  description: string;
  price: string;
  durationMinutes: number;
  createdAt: string;
}

interface DetailServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  userId: string;
  onServiceUpdated: (updatedService: Service) => void;
  onServiceDeleted: (serviceId: string) => void;
}

export default function DetailServiceForm({
  isOpen,
  onClose,
  service,
  userId,
  onServiceUpdated,
  onServiceDeleted,
}: DetailServiceFormProps) {
  const [serviceData, setServiceData] = useState<Service>(service);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: name === "durationMinutes" ? parseInt(value) || 0 : value,
    }));
    setError(null);
  };

  const handleUpdateService = async () => {
    if (!serviceData.typeId.trim()) {
      setError("O tipo de serviço é obrigatório");
      return;
    }

    try {
      const result = await updateService(service.id, userId, {
        typeId: serviceData.typeId,
        description: serviceData.description,
        price: serviceData.price,
        durationMinutes: serviceData.durationMinutes,
      });
      onServiceUpdated(result.service);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar o serviço:", error);
      setError("Erro ao atualizar o serviço. Tente novamente.");
    }
  };

  const handleDeleteService = async () => {
    if (confirm("Tem certeza que deseja deletar este serviço?")) {
      try {
        await deleteService(service.id, userId);
        onServiceDeleted(service.id);
        onClose();
      } catch (error) {
        console.error("Erro ao deletar o serviço:", error);
        setError("Erro ao deletar o serviço. Tente novamente.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg bg-white shadow-xl ">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-violet-800">
            Editar Serviço
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 m-3">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="typeId" className="text-sm font-medium text-gray-700">
              Tipo de Serviço
            </Label>
            <Input
              id="typeId"
              name="typeId"
              value={serviceData.typeId}
              onChange={handleChange}
              className="border-violet-200 focus:ring-violet-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrição
            </Label>
            <Input
              id="description"
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              className="border-violet-200 focus:ring-violet-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              Preço
            </Label>
            <Input
              id="price"
              name="price"
              value={serviceData.price}
              onChange={handleChange}
              className="border-violet-200 focus:ring-violet-500"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationMinutes" className="text-sm font-medium text-gray-700">
              Duração (minutos)
            </Label>
            <Input
              id="durationMinutes"
              name="durationMinutes"
              value={serviceData.durationMinutes}
              onChange={handleChange}
              className="border-violet-200 focus:ring-violet-500"
              type="number"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-2 ">
          <Button
            onClick={handleUpdateService}
            className="w-full bg-violet-600 hover:bg-violet-500 cursor-pointer sm:w-auto"
          >
            Atualizar Serviço
          </Button>
          <Button
            onClick={handleDeleteService}
            className="w-full bg-red-600 hover:bg-red-500 cursor-pointer sm:w-auto"
          >
            Deletar Serviço
          </Button>
          <Button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-500 cursor-pointer sm:w-auto"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}