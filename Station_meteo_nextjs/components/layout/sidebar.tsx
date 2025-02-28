"use client";

import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Cloud, 
  CloudSun, 
  History, 
  Home, 
  Settings 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
  setOpen?: (open: boolean) => void;
}

export function Sidebar({ className, setOpen }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Weather Station",
      icon: Cloud,
      href: "/weather-station",
      active: pathname === "/weather-station",
    },
    {
      label: "ET₀ Prediction",
      icon: CloudSun,
      href: "/et0-prediction",
      active: pathname === "/et0-prediction",
    },
    {
      label: "Historical Data",
      icon: History,
      href: "/historical-data",
      active: pathname === "/historical-data",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4 fixed top-[4rem] left-0 h-full">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen?.(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  route.active ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}