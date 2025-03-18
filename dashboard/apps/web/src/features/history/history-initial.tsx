// history-initial.tsx
import { getAppointmentsByUserId } from "@/services/appointments-services";
import { auth } from "@clerk/nextjs/server";
import { getUserByIdAllInformation } from "@/services/users-services";
import { AppointmentsHistoryTable } from "./components/appointments-history-table";

export const HistoryInitial = async () => {
  const { userId }: any = await auth();
  const allAppointments = await getAppointmentsByUserId(userId, 0, 1000);
  const { user } = await getUserByIdAllInformation(userId);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <AppointmentsHistoryTable appointments={allAppointments} role={user.role} />
    </div>
  );
};