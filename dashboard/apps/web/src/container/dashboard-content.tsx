"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  MoreHorizontal,
  PieChart,
  Scissors,
  Star,
  Users,
  X,
} from "lucide-react"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados de exemplo para agendamentos
const appointments = [
  {
    id: 1,
    client: "Emma Johnson",
    avatar: "/placeholder.svg",
    service: "Corte e Estilização",
    time: "Hoje, 14:30",
    duration: "45 min",
    price: "R$65,00",
    description:
      "Cliente regular solicitando seu corte bob usual com camadas leves e secagem com escova. Cliente prefere Sofia como estilista.",
    status: "pendente",
    notes: "Cliente mencionou que pode chegar 5 minutos atrasada.",
  },
  {
    id: 2,
    client: "Michael Chen",
    avatar: "/placeholder.svg",
    service: "Coloração e Tratamento",
    time: "Hoje, 16:00",
    duration: "120 min",
    price: "R$180,00",
    description:
      "Tratamento completo de coloração com condicionamento Olaplex. Cliente quer mudar de castanho escuro para mechas caramelo.",
    status: "pendente",
    notes: "Cliente de primeira coloração, teste de alergia foi feito ontem.",
  },
  {
    id: 3,
    client: "Sophia Rodriguez",
    avatar: "/placeholder.svg",
    service: "Manicure e Pedicure",
    time: "Amanhã, 10:15",
    duration: "90 min",
    price: "R$95,00",
    description:
      "Manicure e pedicure de luxo com esmalte em gel. Cliente trouxe sua própria cor (Essie - Ballet Slippers).",
    status: "pendente",
    notes: "Cliente solicitou Maria especificamente para este serviço.",
  },
  {
    id: 4,
    client: "James Wilson",
    avatar: "/placeholder.svg",
    service: "Aparagem de Barba e Facial",
    time: "Amanhã, 13:00",
    duration: "60 min",
    price: "R$75,00",
    description: "Aparagem de barba precisa seguida por um tratamento facial hidratante. Cliente tem pele sensível.",
    status: "pendente",
    notes: "Cliente é regular para aparagem de barba, mas é sua primeira facial.",
  },
]

// Função para calcular os serviços mais solicitados
const getTopServices = (appointments: any) => {
  const serviceCount = appointments.reduce((acc: any, { service }: { service: string }) => {
    acc[service] = (acc[service] || 0) + 1
    return acc
  }, {})
  return Object.entries(serviceCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export default function ConteudoDashboard() {
  const [expandedAppointments, setExpandedAppointments] = useState<number[]>([])
  const topServices = getTopServices(appointments)

  const toggleAppointment = (id: number) => {
    setExpandedAppointments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-violet-500">Dashboard do Salão</h1>
          <p className="text-violet-500/70">Gerencie agendamentos e acompanhe o desempenho</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Tabs defaultValue="dia" className="w-full">
            <TabsList className="bg-violet-500 text-white">
              <TabsTrigger value="dia" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">Dia</TabsTrigger>
              <TabsTrigger value="semana" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">Semana</TabsTrigger>
              <TabsTrigger value="mes" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">Mês</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: <Calendar className="h-8 w-8" />, title: "Agendamentos da Semana", value: appointments.length.toString(), change: "+2 de ontem" },
          { icon: <Clock className="h-8 w-8" />, title: "Confirmações Pendentes", value: appointments.filter(a => a.status === "pendente").length.toString(), change: "Ação necessária" },
          { icon: <DollarSign className="h-8 w-8" />, title: "Receita da Semana", value: "R$415,00", change: "+15% da última semana" },
          { icon: <Users className="h-8 w-8" />, title: "Novos Clientes", value: "3", change: "Esta semana" },
        ].map((stat, index) => (
          <Card key={index} className="bg-violet-500 border-none text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="p-2 bg-pink-500 rounded-md text-white">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-white/70">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-violet-500 mb-4">Agendamentos Pendentes</h2>
      <div className="space-y-4 mb-8">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="bg-blue-600 border-none text-white overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <CardTitle className="text-lg">{appointment.client}</CardTitle>
                    <CardDescription className="text-white/70">{appointment.service}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right mr-2">
                    <div className="font-medium">{appointment.time}</div>
                    <div className="text-sm text-white/70">{appointment.duration}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleAppointment(appointment.id)}
                    className="text-white hover:bg-violet-600"
                  >
                    {expandedAppointments.includes(appointment.id) ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-violet-600">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-violet-500 border-none text-white">
                      <DropdownMenuItem className="hover:bg-violet-600 cursor-pointer">Reagendar</DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-violet-600 cursor-pointer">Contactar Cliente</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-violet-600 cursor-pointer">Cancelar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <AnimatePresence>
              {expandedAppointments.includes(appointment.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <CardContent className="pt-0 pb-3">
                    <div className="bg-pink-500 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Scissors className="mr-2 h-4 w-4" /> Detalhes do Serviço
                      </h4>
                      <p className="text-sm text-white/90 mb-3">{appointment.description}</p>
                      {appointment.notes && (
                        <div className="bg-violet-700/50 p-2 rounded text-sm">
                          <span className="font-medium">Notas:</span> {appointment.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex items-center text-sm">
                        <DollarSign className="mr-1 h-4 w-4" />
                        <span className="font-medium mr-1">Preço:</span> {appointment.price}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <Check className="mr-1 h-4 w-4" /> Confirmar
                        </Button>
                        <Button size="sm" variant="outline" className="bg-yellow-400 border-0 text-black hover:bg-yellow-300">
                          Reagendar
                        </Button>
                        <Button size="sm" variant="outline" className="bg-red-500 border-0 text-white hover:bg-red-300">
                          <X className="mr-1 h-4 w-4" /> Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* Seção de Análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detalhamento de Serviços */}


        {/* Melhores Estilistas */}
        <Card className="bg-violet-500 border-none text-white">
          <CardHeader>
            <CardTitle>Clientes mais fies</CardTitle>
            <CardDescription className="text-white/70">Clientes com mais frequencia de agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Sofia Garcia", avatar: "/placeholder.svg",  bookings: 45, rating: 4.9 },
                { name: "Alex Kim", avatar: "/placeholder.svg",  bookings: 38, rating: 4.8 },
                { name: "Maria Lopez", avatar: "/placeholder.svg", bookings: 42, rating: 4.7 },
                { name: "David Chen", avatar: "/placeholder.svg", bookings: 36, rating: 4.6 },
              ].map((stylist, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-violet-600">
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium">{stylist.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">{stylist.bookings} agendamentos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className=" pt-4">
            <Button  className="w-full cursor-pointer bg-white text-violet-700 hover:bg-white">
              Ver clientes mais fies
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}