import "dotenv/config";

const URL_API_BACKEND = process.env.NEXT_PUBLIC_URL_BACKEND;

if (!URL_API_BACKEND) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_URL_BACKEND não foi definida.");
}

export const getUserByIdAllInformation = async (userId: any) => {
  try {
    const response = await fetch(`${URL_API_BACKEND}/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return { error: "Erro ao buscar usuário" };
  }
};

export const getAllUsersFormAdmin = async (initial: any, limite: any, userId: any) => {
  try {
    const response = await fetch(`${URL_API_BACKEND}/api/users?initial=${initial}&limit=${limite}&userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return { error: "Erro ao buscar usuário" };
  }
};
