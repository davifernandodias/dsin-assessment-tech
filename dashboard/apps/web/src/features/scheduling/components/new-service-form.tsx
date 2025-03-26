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
import { createService } from "../actions";
import { Service } from "@/@types/services";


interface NewServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onServiceCreated: (newService: Service) => void;
}

export default function NewServiceForm({
  isOpen,
  onClose,
  userId,
  onServiceCreated,
}: NewServiceFormProps) {
  const [newServiceData, setNewServiceData] = useState<Omit<Service, "id" | "createdAt">>({
    typeId: "",
    description: "",
    price: "0",
    durationMinutes: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewServiceData((prev) => ({
      ...prev,
      [name]: name === "durationMinutes" ? parseInt(value) || 0 : value,
    }));
    setError(null);
  };

  const handleCreateService = async () => {
    if (!newServiceData.typeId.trim()) {
      setError("O tipo de serviço é obrigatório");
      return;
    }

    try {
      const result = await createService(userId, newServiceData);
      onServiceCreated(result.service);
      onClose();
    } catch (error) {
      console.error("Erro ao criar o serviço:", error);
      setError("Erro ao criar o serviço. Tente novamente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-violet-800">
            Criar Novo Serviço
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="typeId" className="text-sm font-medium text-gray-700">
              Tipo de Serviço
            </Label>
            <Input
              id="typeId"
              name="typeId"
              value={newServiceData.typeId}
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
              value={newServiceData.description}
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
              value={newServiceData.price}
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
              value={newServiceData.durationMinutes}
              onChange={handleChange}
              className="border-violet-200 focus:ring-violet-500"
              type="number"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button
            onClick={handleCreateService}
            className="w-full bg-violet-600 hover:bg-violet-500 cursor-pointer sm:w-auto"
          >
            Criar Serviço
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