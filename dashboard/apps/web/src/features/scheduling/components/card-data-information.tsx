"use client";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { NumberTicker } from "@magicui/number-ticker";
import { Clock, Users, Calendar } from "lucide-react";
import { Appointment, Service } from "@/@types/services";

const cardData = [
  {
    title: "Pendentes",
    icon: Clock,
    color: "from-pink-500 to-rose-500",
    borderColor: "border-pink-400",
  },
  {
    title: "Agendados",
    icon: Calendar,
    color: "from-violet-500 to-purple-500",
    borderColor: "border-violet-400",
  },
  {
    title: "Total Clientes",
    icon: Users,
    color: "from-blue-500 to-indigo-500",
    borderColor: "border-blue-400",
  },
];




interface DataInformation {
  appintmentsInformation: Appointment[];
  servicesInformation: Service[];
}

export default function CardDataInformation({ DataInformation }: { DataInformation: DataInformation }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [totalClients, setTotalClients] = useState(0);

  useEffect(() => {
    const pending = DataInformation.appintmentsInformation.filter(
      (appt) => appt.status === "pending"
    ).length;
    setPendingCount(pending);

    const confirmed = DataInformation.appintmentsInformation.filter(
      (appt) => appt.status === "confirmed"
    ).length;
    setConfirmedCount(confirmed);

    const uniqueClients = new Set(
      DataInformation.appintmentsInformation.map((appt) => appt.clientId)
    ).size;
    setTotalClients(uniqueClients);
  }, [DataInformation]);

  const counts = [pendingCount, confirmedCount, totalClients];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {cardData.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={`relative overflow-hidden group transition-all duration-300 hover:scale-105 border-l-4 ${card.borderColor} w-full`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`} />
            <div className="relative flex items-center gap-3 p-4 sm:p-6">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm sm:p-4">
                <Icon className="h-6 w-6 text-white sm:h-8 sm:w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white/80 font-medium text-xs uppercase tracking-wider sm:text-sm">
                  {card.title}
                </h3>
                <NumberTicker
                  value={counts[index] ?? 0}
                  className="text-white text-2xl font-bold sm:text-4xl"
                />
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl sm:-right-8 sm:-bottom-8 sm:w-32 sm:h-32" />
            <div className="absolute -right-2 -top-2 w-16 h-16 bg-white/5 rounded-full blur-xl sm:-right-4 sm:-top-4 sm:w-24 sm:h-24" />
          </Card>
        );
      })}
    </div>
  );
}