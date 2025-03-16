import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-white/80 shadow-sm backdrop-blur-md"
      >
        <div className="container flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">
              Cabeleila<span className="text-teal-500"> Leila</span>
            </h1>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4"
          >
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-blue-700"
            >
              <Bell className="h-5 w-5" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"
              />
            </Button>
          </motion.div>
        </div>
      </motion.header>
    </header>
  );
}
