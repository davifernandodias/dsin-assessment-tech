import { getAppointmentsByUserId } from "@/services/appointments-services";
import { getAllServices } from "@/services/services-services"
import { getAllUsersFormAdmin } from "@/services/users-services"
import { auth } from "@clerk/nextjs/server";
import Dashboard from "./container/dashboard-content";


export const DashboardInitial = async () => {
  const { userId }: any = await auth();
  const allUsers = await getAllUsersFormAdmin(0,1000, userId);
  const allServices = await getAllServices();
  const allAppointments = await getAppointmentsByUserId(userId,0, 1000);
  const {...allDataInformation } = { allUsers, allServices, allAppointments };
  return (
    <div>
      <Dashboard dashboardData={allDataInformation}/>
    </div>
  )
}
