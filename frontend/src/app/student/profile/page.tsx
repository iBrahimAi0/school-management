"use client";

import { useUserContext } from "@/context/UserProvider";
import { Mail, Shield, User as UserIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StudentProfilePage() {
  const { user, role } = useUserContext();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground text-sm">
          View and manage your student profile information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <UserIcon className="h-10 w-10" />
            </div>
            <CardTitle>{user?.name ?? "Student Name"}</CardTitle>
            <CardDescription className="capitalize">
              {role} Portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="capitalize">Status: Active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Details registered in the school registry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-muted-foreground">Full Name</p>
                <p className="mt-1 font-semibold">{user?.name ?? "—"}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">
                  Email Address
                </p>
                <p className="mt-1 font-semibold">{user?.email ?? "—"}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Role</p>
                <p className="mt-1 font-semibold capitalize">
                  {role ?? "Student"}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Student ID</p>
                <p className="mt-1 font-semibold">
                  STU-{user?.id ? String(user.id).padStart(5, "0") : "00101"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
