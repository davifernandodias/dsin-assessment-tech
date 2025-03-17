import { SidebarItem } from "@/components/ui/sidebar-item";
import IconLogoLorempsun from "@public/svg/icons/icon-logo-lorempsun";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  ChartColumnIncreasing,
} from "lucide-react";
import Link from "next/link";

export default function SidebarContent() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-24 bg-white px-4 py-10 shadow-lg transition-all duration-500 ease-in-out dark:bg-gray-900"
    >
      <div className="mb-16 flex items-center justify-center gap-3">
        <IconLogoLorempsun className="h-12 w-11" />
      </div>

      <nav className="flex flex-col gap-12">
        <Link href={"/"}>
          <SidebarItem icon={<LayoutDashboard />} label="Home" path="/" />
        </Link>
        <Link href={"/dashboard"}>
          <SidebarItem
            icon={<ChartColumnIncreasing />}
            label="Dashboard"
            path="/dashboard"
          />
        </Link>
        <Link href={"/history"}>
          <SidebarItem icon={<Clock />} label="Histórico" path="/history" />
        </Link>
        <Link href={"/calendar"}>
          <SidebarItem
            icon={<CalendarDays />}
            label="Calendário"
            path="/calendar"
          />
        </Link>
      </nav>
    </aside>
  );
}
