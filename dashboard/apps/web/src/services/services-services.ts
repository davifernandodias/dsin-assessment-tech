
import { Service } from "@/@types/services";

const URL_API_BACKEND = process.env.NEXT_PUBLIC_URL_BACKEND;

if (!URL_API_BACKEND) {
  throw new Error(
    "A variável de ambiente NEXT_PUBLIC_URL_BACKEND não foi definida."
  );
}

export const getAllServices = async (
  initial: number = 0,
  limit: number = 100,
  userId?: string
): Promise<Service[] | { error: string }> => {
  // Validação dos parâmetros
  if (isNaN(initial)) initial = 0;
  if (isNaN(limit)) limit = 10;
  if (initial < 0) initial = 0;
  if (limit < 0) limit = 10;

  try {
    // Construção segura da URL
    const urlParams = new URLSearchParams({
      initial: initial.toString(),
      limit: limit.toString(),
    });
    if (userId) {
      urlParams.append("userId", userId);
    }

    const url = `${URL_API_BACKEND}/api/services?${urlParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erro na requisição: ${response.status} - ${errorText || response.statusText}`
      );
    }

    const data: Service[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao buscar serviços",
    };
  }
};

export const createService = async (
  dataService: Omit<Service, "id" | "createdAt">,
  userId: string
) => {
  try {
    const url = `${URL_API_BACKEND}/api/services?userId=${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataService),
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao criar serviço",
    };
  }
};

export const updateService = async (
  serviceId: string,
  userId: string,
  updatedService: Omit<Service, "id" | "createdAt">
) => {
  try {
    const url = `${URL_API_BACKEND}/api/services/${serviceId}?userId=${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedService),
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao atualizar serviço",
    };
  }
};

export const deleteService = async (serviceId: string, userId: string) => {
  try {
    const url = `${URL_API_BACKEND}/api/services/${serviceId}?userId=${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    return {
      error: error instanceof Error ? error.message : "Erro ao deletar serviço",
    };
  }
};