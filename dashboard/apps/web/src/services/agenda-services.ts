import "dotenv/config";

const URL_API_BACKEND = process.env.NEXT_PUBLIC_URL_BACKEND;

if (!URL_API_BACKEND) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_URL_BACKEND não foi definida.");
}

export interface GetAllServicesProps {
  initialValue: number;
  limitValue: number;
  userId: string;
}



export const getRuleOfUser = async (userId: string) => {
  try {
    console.log("Fazendo fetch com userId:", userId); 
    const response = await fetch(`${URL_API_BACKEND}/users?userId=${userId}`);
    console.log("Resposta do fetch:", response);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dados recebidos:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar a regra do usuário:", error);
    return { error: "Erro ao buscar a regra do usuário" };
  }
};
export const gettAllServices = async ({ userId, initialValue, limitValue }: GetAllServicesProps) => {
  try {
    const response = await fetch(`${URL_API_BACKEND}/services?userId=${userId}&initial=${initialValue}&limit=${limitValue}`);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro em buscar todos os Serviços: " + error);
    return error;
  }
}
