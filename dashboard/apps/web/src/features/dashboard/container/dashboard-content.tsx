"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion"; 
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  XAxis,
  YAxis,
} from "recharts";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Scissors,
  Users,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment, Service } from "@/@types/services";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  createdAt: string;
}



interface DashboardData {
  allUsers: User[];
  allServices: Service[];
  allAppointments: Appointment[];
}

interface DashboardProps {
  dashboardData: DashboardData;
}

const serviceTypeNames: Record<string, string> = {
  "type-001": "Corte Masculino",
  "type-002": "Corte Feminino",
  "type-003": "Coloração",
  "type-004": "Mechas",
  "type-005": "Escova Progressiva",
};

const COLORS = ["#FF9ECD", "#F2C1D1", "#D8A7B1", "#B6649A", "#C48FD9"];
const STATUS_COLORS: Record<string, string> = {
  finished: "#9D65C9",
  pending: "#FFAAA7",
  canceled: "#FF8FAB",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Dashboard({ dashboardData }: DashboardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeFilter, setTimeFilter] = useState("all");
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const userRole = dashboardData.allUsers.find((u) => u.id === user.id)?.role;
      if (userRole !== "Admin") {
        router.push("/access-denied");
      }
    }
  }, [isLoaded, user, dashboardData, router]);

  if (!isLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen items-center justify-center"
      >
        Carregando...
      </motion.div>
    );
  }

  const getFilteredAppointments = () => {
    const now = new Date();
    const appointments = dashboardData.allAppointments;

    if (timeFilter === "all") return appointments;

    if (timeFilter === "month") {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      return appointments.filter((appointment) => {
        const date = new Date(appointment.scheduledAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });
    }

    if (timeFilter === "week") {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      return appointments.filter((appointment) => {
        const date = new Date(appointment.scheduledAt);
        return date >= oneWeekAgo && date <= now;
      });
    }

    return appointments;
  };

  const calculateStats = () => {
    const filteredAppointments = getFilteredAppointments();

    const finishedAppointments = filteredAppointments.filter((a) => a.status === "finished");
    const totalRevenue = finishedAppointments.reduce((total, appointment) => {
      const service = dashboardData.allServices.find((s) => s.id === appointment.serviceId);
      return total + (service ? Number.parseFloat(service.price) : 0);
    }, 0);

    const statusCounts = {
      finished: filteredAppointments.filter((a) => a.status === "finished").length,
      pending: filteredAppointments.filter((a) => a.status === "pending").length,
      canceled: filteredAppointments.filter((a) => a.status === "canceled").length,
    };

    const serviceTypeCounts: Record<string, number> = {};
    filteredAppointments.forEach((appointment) => {
      const service = dashboardData.allServices.find((s) => s.id === appointment.serviceId);
      if (service) {
        const { typeId } = service;
        serviceTypeCounts[typeId] = (serviceTypeCounts[typeId] || 0) + 1;
      }
    });

    const revenueByType: Record<string, number> = {};
    finishedAppointments.forEach((appointment) => {
      const service = dashboardData.allServices.find((s) => s.id === appointment.serviceId);
      if (service) {
        const { typeId, price } = service;
        revenueByType[typeId] = (revenueByType[typeId] || 0) + Number.parseFloat(price);
      }
    });

    return {
      totalRevenue,
      statusCounts,
      serviceTypeCounts,
      revenueByType,
      totalAppointments: filteredAppointments.length,
    };
  };

  const stats = calculateStats();

  const statusData = [
    { name: "Finalizados", value: stats.statusCounts.finished, color: STATUS_COLORS.finished },
    { name: "Pendentes", value: stats.statusCounts.pending, color: STATUS_COLORS.pending },
    { name: "Cancelados", value: stats.statusCounts.canceled, color: STATUS_COLORS.canceled },
  ];

  const serviceTypeData = Object.entries(stats.serviceTypeCounts).map(
    ([typeId, count], index) => ({
      name: serviceTypeNames[typeId] || typeId,
      value: count,
      color: COLORS[index % COLORS.length],
    })
  );

  const revenueByTypeData = Object.entries(stats.revenueByType).map(
    ([typeId, revenue], index) => ({
      name: serviceTypeNames[typeId] || typeId,
      value: revenue,
      color: COLORS[index % COLORS.length],
    })
  );

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } =
      props;

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#888">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" fontSize={20} fontWeight="bold">
          {value}
        </text>
        <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#888">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <motion.div
      className="flex flex-col -mt-10 min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header>
        <motion.div
          className="container flex h-16 items-center px-4 sm:px-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-pink-800">Dashboard de Vendas e Serviços</h1>
          <div className="ml-auto flex items-center gap-4">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className=" w-[180px] border-pink-200">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </header>
      <motion.main
        className="flex-1 py-6 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container">
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants}>
              <Card className=" shadow-sm">
                <CardHeader className="flex flex-row  items-center justify-between space-y-0 pb-2 bg-gradient-to-r  rounded-t-lg">
                  <CardTitle className="text-sm font-medium text-pink-800 ">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-pink-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-700">
                    R$ {stats.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-pink-500">
                    De {stats.statusCounts.finished} serviços finalizados
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Card className=" shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r rounded-t-lg">
                  <CardTitle className="text-sm font-medium text-purple-800">Agendamentos</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-700">{stats.totalAppointments}</div>
                  <div className="flex gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 hover:bg-purple-50"
                    >
                      {stats.statusCounts.finished} finalizados
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-pink-50 text-pink-700 hover:bg-pink-50"
                    >
                      {stats.statusCounts.pending} pendentes
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Card className=" shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r rounded-t-lg">
                  <CardTitle className="text-sm font-medium text-fuchsia-800">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-fuchsia-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-fuchsia-700">
                    {dashboardData.allUsers.filter((u) => u.role === "Client").length}
                  </div>
                  <p className="text-xs text-fuchsia-500">Clientes cadastrados no sistema</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants}>
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r  rounded-t-lg">
                  <CardTitle className="text-sm font-medium text-rose-800">Serviços</CardTitle>
                  <Scissors className="h-4 w-4 text-rose-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-700">
                    {dashboardData.allServices.length}
                  </div>
                  <p className="text-xs text-rose-500">Tipos de serviços disponíveis</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="bg-pink-100 p-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
              >
                Serviços
              </TabsTrigger>
              <TabsTrigger
                value="revenue"
                className="data-[state=active]:bg-white data-[state=active]:text-fuchsia-700"
              >
                Receita
              </TabsTrigger>
            </TabsList>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
            >
              <TabsContent value="overview" asChild>
                <motion.div variants={tabVariants} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>Status dos Agendamentos</CardTitle>
                        <CardDescription>Distribuição por status</CardDescription>
                      </CardHeader>
                      <CardContent className="px-2">
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                              >
                                {statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-2">
                          {statusData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm">{entry.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="col-span-1 lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Serviços por Tipo</CardTitle>
                        <CardDescription>
                          Quantidade de serviços realizados por categoria
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="px-2">
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={serviceTypeData}
                              layout="vertical"
                              margin={{ left: 100 }}
                            >
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="name" width={100} />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {serviceTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
              <TabsContent value="services" asChild>
                <motion.div variants={tabVariants} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes dos Serviços</CardTitle>
                      <CardDescription>Informações sobre os serviços oferecidos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {dashboardData.allServices.map((service) => (
                          <motion.div
                            key={service.id}
                            className="rounded-lg border p-4"
                            variants={cardVariants}
                          >
                            <div className="flex items-center gap-2">
                              <Scissors className="h-4 w-4 text-muted-foreground" />
                              <h3 className="font-medium">{serviceTypeNames[service.typeId]}</h3>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{service.durationMinutes} min</span>
                              </div>
                              <div className="font-medium">R$ {service.price}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="revenue" asChild>
                <motion.div variants={tabVariants} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Receita por Tipo de Serviço</CardTitle>
                      <CardDescription>
                        Distribuição da receita por categoria de serviço
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2">
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={revenueByTypeData}
                            layout="vertical"
                            margin={{ left: 100 }}
                          >
                            <XAxis type="number" tickFormatter={(value) => `R$ ${value}`} />
                            <YAxis type="category" dataKey="name" width={100} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {revenueByTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {revenueByTypeData.map((item, index) => (
                      <motion.div key={index} variants={cardVariants}>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">R$ {item.value.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">
                              {((item.value / stats.totalRevenue) * 100).toFixed(1)}% da receita
                              total
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </motion.main>
    </motion.div>
  );
}