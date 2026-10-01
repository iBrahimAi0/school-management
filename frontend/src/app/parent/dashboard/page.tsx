"use client";
import { useUserContext } from "@/context/UserProvider";
import {
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Users,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ParentDashboard() {
  const { user } = useUserContext();

  const parentName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "Parent";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, {parentName} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          Welcome to the School Parent Control Panel.
        </p>
      </div>
    </div>
  );
}
