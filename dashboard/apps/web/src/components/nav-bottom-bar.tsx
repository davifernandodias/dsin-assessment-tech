"use client";

import { motion } from "framer-motion";
import { Home, CalendarDays, Clock, User, Plus } from "lucide-react";
import NavItem from "./nav-item";
import { Button } from "@/components/ui/button";

export default function NavBottomBar() {
  return (
    // Bottom Navigation
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-2"
    >
      <div className="flex items-center justify-around">
        <NavItem
          icon={<Home className="h-6 w-6" />}
          label="Início"
          href="/"
          isActive={true}
        />
        <NavItem
          icon={<CalendarDays className="h-6 w-6" />}
          label="Agenda"
          href="/calendar"
          isActive={false}
        />

        <motion.div className="relative -mt-5" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <motion.div
            animate={{
              boxShadow: [
                "0px 0px 0px rgba(59, 130, 246, 0)",
                "0px 0px 20px rgba(59, 130, 246, 0.5)",
                "0px 0px 0px rgba(59, 130, 246, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Button className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 shadow-lg">
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        </motion.div>

        <NavItem
          icon={<Clock className="h-6 w-6" />}
          label="Serviços"
          href="/services"
          isActive={false}
        />
        <NavItem
          icon={<User className="h-6 w-6" />}
          label="Perfil"
          href="/profile"
          isActive={false}
        />
      </div>
    </motion.nav>
  );
}
