import Header from "@/components/header";
import { HistoryInitial } from "@/features/history/history-initial";

export default async function HistoryPage() {


  return (
    <section className="w-full">
      <div className="flex flex-col gap-16 px-16 py-10">
      <Header />
      <HistoryInitial />
      </div>
    </section>
  );
}