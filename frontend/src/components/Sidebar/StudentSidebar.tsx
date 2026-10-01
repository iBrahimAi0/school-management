"use client";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { AppSidebar } from "../add-sidebar";

export function StudentSidebar({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider className="min-h-[calc(100vh-4rem)] w-full">
      <AppSidebar />
      {children ? (
        <SidebarInset className="overflow-x-hidden">{children}</SidebarInset>
      ) : null}
    </SidebarProvider>
  );
}
