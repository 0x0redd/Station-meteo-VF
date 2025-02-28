"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Cloud, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Sidebar } from "./sidebar";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className=" flex h-16 items-center justify-between !w-full">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 sm:max-w-xs">
              <Sidebar setOpen={setOpen} />
            </SheetContent>
          </Sheet>
          <a href="/" className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            <span className="font-bold">Weather Dashboard</span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}