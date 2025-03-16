import { SidebarItem } from "@/components/ui/sidebar-item";
import IconLogoLorempsun from "@public/svg/icons/icon-logo-lorempsun";
import { LayoutDashboard, Clock, CalendarDays, ChartColumnIncreasing } from "lucide-react";

export default function SidebarContent() {
  return (
    <div className="relative flex">
      <aside
        className={`h-screen bg-white dark:bg-gray-900 shadow-lg flex flex-col py-10 px-4 rounded-r-2xl transition-all duration-500 ease-in-out transform w-22`}
      >
        <div className="flex gap-3 justify-center items-center mb-16">
          <IconLogoLorempsun className="h-12 w-11" />
        </div>

        <nav className={`flex flex-col gap-12`}>
          <SidebarItem icon={<LayoutDashboard />} label="Home" />
          <SidebarItem icon={<ChartColumnIncreasing />} label="Dashboard" />
          <SidebarItem icon={<Clock />} label="Histórico" />
          <SidebarItem icon={<CalendarDays />} label="Calendário" />
        </nav>
      </aside>
    </div>
  );
}
