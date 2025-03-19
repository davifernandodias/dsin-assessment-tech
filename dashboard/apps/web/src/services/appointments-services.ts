
const URL_API_BACKEND = process.env.NEXT_PUBLIC_URL_BACKEND;

if (!URL_API_BACKEND) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_URL_BACKEND não foi definida.");
}

export const getAppointmentsByUserId = async (
  userId: string,
  initial: number = 0,
  limit: number = 10
) => {
  try {
    const url = `${URL_API_BACKEND}/api/appointments?userId=${userId}&initial=${initial}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return { error: "Erro ao buscar agendamentos" };
  }
};

export const updateAppointmentsByUser = async (
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
    const url = `${URL_API_BACKEND}/api/appointments/${appointmentId}?userId=${userId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    throw error;
  }
};

export const createAppointmentesServiceFetch = async (
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
  const url = `${URL_API_BACKEND}/api/appointments?userId=${userId}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.appointment;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw error;
  }
};