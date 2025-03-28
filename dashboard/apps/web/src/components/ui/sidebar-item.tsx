"use client"; 
import { ReactElement } from "react";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
  icon: ReactElement;
  label: string;
  path: string;
};

export function SidebarItem({ icon, label, path }: SidebarItemProps) {
  const currentPath = usePathname(); 
  const isActive = currentPath === path;

  return (
    <div
      className={`relative group flex items-center justify-center 
        ${isActive ? "bg-gray-200 dark:bg-gray-700" : ""}  
        p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all`}
    >
      <div className="flex items-center justify-center p-0.5">{icon}</div>

      {/* Tooltip exibido acima com transição suave */}
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0.5 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:mb-3 transition-all duration-300 ease-in-out">
        {label}
      </span>
    </div>
  );
}
