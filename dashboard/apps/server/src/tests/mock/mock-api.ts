import { User } from "@repo/db/schema";

export const UserMockAdmin: User = {
  id: "unique-user-id-admin-teste",
  email: "testeboa@example.com",
  name: "Nome do Usuárioda",
  phone: "2424252529", 
  role: "Admin",
  createdAt: null, 
};


export const UserMockClient: User = {
  id: "unique-user-id-client",
  email: "client-emailtest@example.com",
  name: "Nome user12",
  phone: "169594032", 
  role: "Client",
  createdAt: null, 
};