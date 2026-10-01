"use client";

import { useUserContext } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { RoleSidebar } from "@/components/Sidebar/RoleSidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loader } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loader) {
      if (!user) {
        router.replace("/login");
      } else if (role && role !== "admin") {
        router.replace(`/${role}/dashboard`);
      }
    }
  }, [user, role, loader, router]);

  if (loader || !user || role !== "admin") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <SpinnerSize />
      </div>
    );
  }

  return (
    <SidebarProvider className="min-h-[calc(100vh-4rem)] w-full">
      <RoleSidebar role="admin" />
      <SidebarInset className="flex flex-col flex-1 w-full overflow-x-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 bg-background/95 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            Admin Portal
          </span>
        </header>
        <div className="flex-1 w-full p-6 overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
