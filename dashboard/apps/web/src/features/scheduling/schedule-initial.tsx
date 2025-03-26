import { getAppointmentsByUserId } from "@/services/appointments-services";
import { getAllServices } from "@/services/services-services";
import { getAllUsersFormAdmin, getUserByIdAllInformation } from "@/services/users-services";
import { auth } from "@clerk/nextjs/server";
import ScheduleAdminPanel from "./container/schedule-admin-panel";
import ClientSchedulePanel from "./container/schedule-client-panel";
import { ClientData, Service } from "@/@types/services";

export const InitialSchedule = async () => {
  const { userId }: any = await auth();
  const { user } = await getUserByIdAllInformation(userId);
  const appintmentsInformation = await getAppointmentsByUserId(userId, 0, 500);
  
  const servicesResult = await getAllServices(0, 500, userId);
  let servicesInformation: Service[] = [];
  if ("error" in servicesResult) {
    console.error("Erro ao buscar serviços:", servicesResult.error);
  } else {
    servicesInformation = servicesResult;
  }
  
  console.log(servicesInformation, "servicesInformationnnnnnnn");
  const usersInformation = await getAllUsersFormAdmin(0, 10, userId);
  const { ...DataInformation } = { appintmentsInformation, servicesInformation, usersInformation };
  
  const clientData: ClientData = {
    appointments: appintmentsInformation,
    services: servicesInformation,
  };
  
  if (!userId) {
    return (
      <div>
        <p>Erro: Nenhum usuário autenticado encontrado.</p>
      </div>
    );
  }

  if (user.role === "Admin") {
    return <ScheduleAdminPanel userId={userId} role={user.role} DataInformation={DataInformation} />;
  } else {
    return <ClientSchedulePanel userId={userId} role={user.role} clientData={clientData} userData={user} />;
  }
};