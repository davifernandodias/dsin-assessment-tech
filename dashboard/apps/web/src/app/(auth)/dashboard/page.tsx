import { auth } from "@clerk/nextjs/server";
import { getUserByIdAllInformation } from "@/services/users-services"; 
import { redirect } from "next/navigation";
import Header from "@/components/header";
import { DashboardInitial } from "@/features/dashboard/dashboard-initial";

export default async function DashboardPage() {
  const { userId }: any = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { user } = await getUserByIdAllInformation(userId);

  if (user?.role !== "Admin") {
    redirect("/access-denied");
  }

  return (
    <section className="w-full">
      <div className="flex flex-col gap-16 px-16 py-10">
      <Header />
      <DashboardInitial />
      </div>
    </section>
  );
}