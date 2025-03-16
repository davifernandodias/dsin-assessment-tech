import { motion } from "framer-motion";
import Link from "next/link";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

export default function NavItem({ icon, label, href, isActive }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`flex flex-col items-center ${isActive ? "text-blue-600" : "text-gray-500"}`}
      >
        {icon}
        <span className="mt-1 text-xs">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="mt-1 h-1 w-5 rounded-full bg-blue-600"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
}
