import { AppointmentCardProps } from "@/interfaces/appointment.card";
import { CalendarIcon, Clock } from "lucide-react";

export default function AppointmentCard({
  clientName= "bia",
  professionalName = "Sabrina",
  service = "Cabelos",
  description = "Preciso cortar o cabelo e tingir a unha do meu cabelo tradicional",
  progress = 98,
  date = "Mar 15, 2025",
  time = "10:30M",
}: AppointmentCardProps) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-blue-500 bg-white shadow-sm">
      <div className="space-y-4 p-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-medium">
            Profissional, <span className="font-bold">{professionalName}.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 divide-y divide-gray-100">
          <div className="py-3">
            <p className="mb-1 font-medium">Serviço agendado:</p>
            <p className="text-gray-600">{service}</p>
            <p>{clientName}</p>
          </div>

          <div className="py-3">
            <p className="mb-1 font-medium">Descrição:</p>
            <div className="rounded border border-blue-200 bg-blue-100 p-3 text-blue-800">
              {description}
            </div>
          </div>

          <div className="space-y-3 py-3">
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-blue-500"
                style={{ width: `${progress}%` }}
              >
                <div className="float-right h-full w-2 rounded-full bg-black"></div>
              </div>
            </div>
            <p className="text-right text-sm text-gray-600">{progress}%</p>

            <div className="flex items-center justify-start gap-6 pt-2">
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarIcon className="h-5 w-5" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
