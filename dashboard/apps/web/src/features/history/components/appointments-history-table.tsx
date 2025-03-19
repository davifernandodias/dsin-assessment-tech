"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment, AppointmentsHistoryTableProps } from "@/@types/services";



const statusStyles: Record<
  string,
  { variant: "default" | "secondary" | "destructive"; text: string; bgColor: string }
> = {
  finished: { variant: "default", text: "Finalizado", bgColor: "bg-purple-200" },
  pending: { variant: "secondary", text: "Pendente", bgColor: "bg-pink-200" },
  canceled: { variant: "destructive", text: "Cancelado", bgColor: "bg-rose-200" },
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const serviceNames: Record<string, string> = {
  "service-001": "Corte Masculino",
  "service-002": "Corte Feminino",
  "service-003": "Coloração",
  "service-004": "Mechas",
  "service-005": "Escova Progressiva",
};

export const AppointmentsHistoryTable = ({ appointments, role }: AppointmentsHistoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginatedAppointments, setPaginatedAppointments] = useState<Appointment[]>([]);

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedAppointments(appointments.slice(startIndex, endIndex));
  }, [currentPage, itemsPerPage, appointments]);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderAdminView = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow-lg rounded-lg overflow-hidden border border-pink-100"
    >
      <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <h2 className="text-xl font-semibold text-purple-800">Todos os Agendamentos</h2>
        <p className="text-sm text-pink-600">Visão geral para administradores</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-purple-50">
            <TableHead className="text-purple-700 font-semibold">ID</TableHead>
            <TableHead className="text-purple-700 font-semibold">Cliente</TableHead>
            <TableHead className="text-purple-700 font-semibold">Telefone</TableHead>
            <TableHead className="text-purple-700 font-semibold">Serviço</TableHead>
            <TableHead className="text-purple-700 font-semibold">Data/Hora</TableHead>
            <TableHead className="text-purple-700 font-semibold">Status</TableHead>
            <TableHead className="text-purple-700 font-semibold">Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAppointments.map((appointment) => (
            <motion.tr
              key={appointment.id}
              variants={itemVariants}
              className="hover:bg-pink-50"
            >
              <TableCell className="text-gray-700">{appointment.id}</TableCell>
              <TableCell className="text-gray-700">{appointment.clientName}</TableCell>
              <TableCell className="text-gray-700">{appointment.clientPhone}</TableCell>
              <TableCell className="text-gray-700">
                {serviceNames[appointment.serviceId] || appointment.serviceId}
              </TableCell>
              <TableCell className="text-gray-700">
                {formatDateTime(appointment.scheduledAt)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={statusStyles[appointment.status]?.variant || "secondary"}
                  className={`${statusStyles[appointment.status]?.bgColor} text-gray-800`}
                >
                  {statusStyles[appointment.status]?.text || appointment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700">
                {formatDateTime(appointment.createdAt)}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4 bg-purple-50 border-t border-pink-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-700">Itens por página:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[80px] border-pink-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            Anterior
          </Button>
          <span className="text-sm text-purple-700">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            Próxima
          </Button>
        </div>
        <div className="text-sm text-purple-700">
          Total: {appointments.length} agendamentos
        </div>
      </div>
    </motion.div>
  );

  const renderClientView = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="p-4 bg-gradient-to-r from-rose-50 to-fuchsia-50 rounded-lg">
        <h2 className="text-xl font-semibold text-rose-800">Meus Agendamentos</h2>
        <p className="text-sm text-fuchsia-600">Seus agendamentos passados e futuros</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedAppointments.map((appointment) => (
          <motion.div key={appointment.id} variants={itemVariants}>
            <Card className="border-rose-100 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-fuchsia-50">
                <CardTitle className="text-lg font-medium text-fuchsia-800">
                  {serviceNames[appointment.serviceId] || appointment.serviceId}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-rose-700">Data:</span>{" "}
                    {formatDateTime(appointment.scheduledAt)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-rose-700">Status:</span>{" "}
                    <Badge
                      variant={statusStyles[appointment.status]?.variant || "secondary"}
                      className={`${statusStyles[appointment.status]?.bgColor} text-gray-800`}
                    >
                      {statusStyles[appointment.status]?.text || appointment.status}
                    </Badge>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-rose-700">Telefone:</span>{" "}
                    {appointment.clientPhone}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-rose-700">Criado em:</span>{" "}
                    {formatDateTime(appointment.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between p-4 bg-fuchsia-50 rounded-lg border-t border-rose-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-rose-700">Itens por página:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[80px] border-rose-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            Anterior
          </Button>
          <span className="text-sm text-rose-700">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            Próxima
          </Button>
        </div>
        <div className="text-sm text-rose-700">
          Total: {appointments.length} agendamentos
        </div>
      </div>
    </motion.div>
  );

  return (
    <div>
      {role === "Admin" ? renderAdminView() : renderClientView()}
    </div>
  );
};