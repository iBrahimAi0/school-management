"use client";

import { LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { DashboardIcon } from "./icons/akar-icons-dashboard";
import { useUserContext } from "@/context/UserProvider";

export function DropdownMenuIcons({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { role, logout } = useUserContext();
  const dashboardUrl = role ? `/${role}/dashboard` : "/login";
  const profileUrl = role === "student" ? "/student/profile" : dashboardUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {children}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href={dashboardUrl}
            className="flex items-center gap-2 cursor-pointer w-full"
          >
            <DashboardIcon />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={profileUrl}
            className="flex items-center gap-2 cursor-pointer w-full"
          >
            <UserIcon className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => logout()}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive w-full"
        >
          <LogOutIcon className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
