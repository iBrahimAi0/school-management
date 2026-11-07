"use client";

import { useUserContext } from "@/context/UserProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { user, role } = useUserContext();

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center max-w-5xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          School Management Platform
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Modern Management for <br className="hidden sm:inline" />
          <span className="text-primary">Students, Teachers & Admins</span>
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg">
          Seamless multi-role portal system. Switch between dedicated layouts
          for students, faculty, and school administration.
        </p>
      </div>

      <div>
        {user ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Logged in as{" "}
              <strong className="text-foreground capitalize">{role}</strong> (
              {user.name || user.email})
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href={`/${role}/dashboard`}>
                <span>
                  Go to Your {role ? role.toUpperCase() : ""} Dashboard
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/login">
                <span>Sign In to Your Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Role Previews / Test Accounts */}
      <div className="grid gap-6 sm:grid-cols-3 w-full text-left">
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 mb-2">
              <GraduationCap className="h-6 w-6" />
            </div>
            <CardTitle>Student Portal</CardTitle>
            <CardDescription>
              Access courses, check attendance, review grades and manage profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/60 p-2.5 text-xs font-mono space-y-1">
              <p className="text-muted-foreground">
                Email: <span className="text-foreground">test@example.com</span>
              </p>
              <p className="text-muted-foreground">
                Pass: <span className="text-foreground">password123</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 mb-2">
              <UserCheck className="h-6 w-6" />
            </div>
            <CardTitle>Teacher Portal</CardTitle>
            <CardDescription>
              Manage assigned classes, mark attendance, and manage examinations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/60 p-2.5 text-xs font-mono space-y-1">
              <p className="text-muted-foreground">
                Email:{" "}
                <span className="text-foreground">teacher@example.com</span>
              </p>
              <p className="text-muted-foreground">
                Pass: <span className="text-foreground">teacher123456</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle>Admin Portal</CardTitle>
            <CardDescription>
              Full administrative control over students, teachers, classes, and
              settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/60 p-2.5 text-xs font-mono space-y-1">
              <p className="text-muted-foreground">
                Email: <span className="text-foreground">admin@example.com</span>
              </p>
              <p className="text-muted-foreground">
                Pass: <span className="text-foreground">admin123456</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
