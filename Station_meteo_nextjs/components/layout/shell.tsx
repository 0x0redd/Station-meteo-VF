import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r md:block">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}