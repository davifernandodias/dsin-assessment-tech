import { Appointment, Service, User } from "@repo/db/schema";

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

export const servicesTypesMock = {
  id: "unique-service-type-id",
  name: "type-teste"
}


export const ServicesMock: Service = {
  id: "unique-service-id",
  typeId: servicesTypesMock.id,
  description: "Descrição do serviço",
  price: "190",
  createdAt: null,
  durationMinutes: 60,
};

export const AppointmentsMock: Appointment = {
  id: "unique-appointment-id",
  serviceId: ServicesMock.id,
  clientId: UserMockClient.id,
  scheduledAt: new Date(),
  status: "pending",
  createdAt: null,
};