import { Service } from "@/@types/services";
import { createAppointmentesServiceFetch, updateAppointmentsByUser } from "@/services/appointments-services";
import { createService as createServiceAPI, updateService as updateServiceAPI, deleteService as deleteServiceAPI } from "@/services/services-services";

export const updateStatusSchedule = async (
  appointmentId: string,
  userId: string,
  updatedData: Partial<{
    clientName: string;
    serviceId: string;
    scheduledAt: string;
    status: string;
    clientPhone: string | null;
  }>
) => {
  try {
    const result = await updateAppointmentsByUser(appointmentId, userId, updatedData);
    return result;
  } catch (error) {
    console.error("Erro na ação de atualização de status:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar o agendamento"
    );
  }
};

export const createService = async (
  userId: string,
  newService: Omit<Service, "id" | "createdAt">
) => {
  try {
    const response = await createServiceAPI(newService, userId);
    if ("error" in response) {
      throw new Error(response.error);
    }
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido ao criar serviço";
    console.error("Erro na ação de criação de serviço:", error);
    throw new Error(errorMessage);
  }
};

export const updateService = async (
  serviceId: string,
  userId: string,
  updatedService: Omit<Service, "id" | "createdAt">
) => {
  try {
    const response = await updateServiceAPI(serviceId, userId, updatedService);
    if ("error" in response) {
      throw new Error(response.error);
    }
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido ao atualizar serviço";
    console.error("Erro na ação de atualização de serviço:", error);
    throw new Error(errorMessage);
  }
};

export const deleteService = async (serviceId: string, userId: string) => {
  try {
    const response = await deleteServiceAPI(serviceId, userId);
    if ("error" in response) {
      throw new Error(response.error);
    }
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido ao deletar serviço";
    console.error("Erro na ação de deleção de serviço:", error);
    throw new Error(errorMessage);
  }
};

export const createAppointment = async (
  userId: string,
  appointmentData: {
    clientId: string;
    serviceId: string;
    scheduledAt: string;
    status?: string;
    clientName: string;
    clientPhone: string | null;
  }
) => {
  try {
    const result = await createAppointmentesServiceFetch(userId, appointmentData);
    return result; 
  } catch (error) {
    console.error("Erro na ação de criação de agendamento:", error);
    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar o agendamento"
    );
  }
};