import Header from "@/components/header";
import { InitialSchedule } from "@/features/scheduling/schedule-initial";

export default function HomePage() {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-16 px-16 py-10">
      <Header />
      <InitialSchedule />
      </div>
    </section>
  );
}
