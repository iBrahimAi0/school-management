"use client";

import { useUserContext } from "@/context/UserProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Users,
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  School,
  CheckCircle2,
  TrendingUp,
  UserRoundGroup,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { user, role } = useUserContext();

  const portals = [
    {
      title: "Administrator Hub",
      role: "admin",
      badge: "Operational Control",
      badgeVariant: "default" as const,
      icon: ShieldCheck,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
      description:
        "Total institutional governance: manage faculty teachers, student rosters, parent accounts, classes, curriculum courses, and exams.",
      email: "admin@example.com",
      pass: "admin123456",
      features: ["Faculty & student directories", "Class & course management", "System audit & live statistics"],
    },
    {
      title: "Teacher Portal",
      role: "teacher",
      badge: "Faculty Tools",
      badgeVariant: "secondary" as const,
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      description:
        "Comprehensive academic tools: track daily attendance sessions, grade exams, inspect student performance, and upload curriculum assessments.",
      email: "teacher@example.com",
      pass: "teacher123456",
      features: ["Daily session attendance", "Grading & continuous assessment", "Course syllabus & student lists"],
    },
    {
      title: "Student Portal",
      role: "student",
      badge: "Learner Workspace",
      badgeVariant: "outline" as const,
      icon: GraduationCap,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
      description:
        "Personal learning space: review assigned courses, check attendance standing in real-time, view exam grades with teacher remarks, and inspect profile.",
      email: "student@example.com",
      pass: "student123456",
      features: ["Live attendance records & stats", "Assessment grades & feedback", "Official registry profile"],
    },
    {
      title: "Parent Portal",
      role: "parent",
      badge: "Guardian Oversight",
      badgeVariant: "secondary" as const,
      icon: UserRoundGroup,
      color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
      description:
        "Full parental visibility: monitor your children's real-time attendance, track examination results, and connect directly with assigned educators.",
      email: "parent@example.com",
      pass: "parent123456",
      features: ["Real-time child attendance alerts", "Academic evaluation transcripts", "Assigned class & teacher contacts"],
    },
  ];

  const highlights = [
    {
      icon: CalendarCheck2,
      title: "Real-Time Attendance Ledger",
      desc: "Fast, accurate attendance tracking for daily lectures with automated presence statistics and rate calculation.",
    },
    {
      icon: FileCheck2,
      title: "Examinations & Grading",
      desc: "Comprehensive evaluation ledger supporting CC and EFM assessment structures, paper uploads, and instant feedback.",
    },
    {
      icon: Layers,
      title: "Curriculum & Class Sections",
      desc: "Flexible academic tracks linking classes to multidisciplinary courses and faculty specialists without data duplication.",
    },
    {
      icon: Lock,
      title: "Airtight Token RBAC",
      desc: "Laravel Sanctum multi-guard authorization ensuring strict security barriers between administrative, faculty, and student portals.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Generation Institutional Management Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Modern School Management for{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-muted-foreground text-base sm:text-lg leading-relaxed">
            A single, high-performance platform seamlessly connecting Administrators, Faculty Teachers,
            Students, and Parents with instant real-time data synchronization.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Signed in as <strong className="text-foreground capitalize">{role}</strong> ({user.name || user.email})
                </p>
                <Button asChild size="lg" className="gap-2 shadow-sm">
                  <Link href={`/${role}/dashboard`}>
                    <span>Open {role?.toUpperCase()} Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="gap-2 shadow-sm">
                  <Link href="/login">
                    <span>Sign In to Your Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#portals">Explore Demo Accounts</a>
                </Button>
              </div>
            )}
          </div>

          {/* Quick Metrics Banner */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="rounded-xl border p-4 bg-card/60 backdrop-blur-sm shadow-xs">
              <p className="text-2xl font-bold text-foreground">1,250+</p>
              <p className="text-xs text-muted-foreground mt-0.5">Enrolled Learners</p>
            </div>
            <div className="rounded-xl border p-4 bg-card/60 backdrop-blur-sm shadow-xs">
              <p className="text-2xl font-bold text-foreground">45+</p>
              <p className="text-xs text-muted-foreground mt-0.5">Faculty Specialists</p>
            </div>
            <div className="rounded-xl border p-4 bg-card/60 backdrop-blur-sm shadow-xs">
              <p className="text-2xl font-bold text-foreground">98.4%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Attendance Reliability</p>
            </div>
            <div className="rounded-xl border p-4 bg-card/60 backdrop-blur-sm shadow-xs">
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Real-Time Transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Stakeholder Portals Showcase */}
      <section id="portals" className="py-16 bg-muted/20 border-b">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Four Tailored Stakeholder Portals</h2>
            <p className="text-muted-foreground text-sm">
              Each portal is engineered specifically for the distinct operational needs of its user role.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {portals.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.role} className="flex flex-col shadow-xs hover:shadow-md transition-shadow bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2.5 rounded-lg border ${p.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant={p.badgeVariant} className="text-[11px]">
                        {p.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed line-clamp-3">
                      {p.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1 text-xs">
                    <div className="space-y-1.5 border-t pt-3">
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg bg-muted/60 p-2.5 font-mono text-[11px] space-y-1 border">
                      <p className="text-muted-foreground truncate">
                        Email: <span className="text-foreground font-semibold">{p.email}</span>
                      </p>
                      <p className="text-muted-foreground truncate">
                        Pass: <span className="text-foreground font-semibold">{p.pass}</span>
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button asChild variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                      <Link href="/login">
                        <span>Sign In ({p.title.split(" ")[0]})</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Institutional Architecture & Capabilities</h2>
            <p className="text-muted-foreground text-sm">
              Built on enterprise-grade relational modeling with high throughput and zero data fragmentation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="p-5 rounded-xl border bg-card space-y-3 shadow-xs">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-base">{h.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted/30 py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">School Management System</span>
            <span>&bull;</span>
            <span>Laravel 11 & Next.js 16</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
            <Link href="/student/dashboard" className="hover:underline">
              Student Portal
            </Link>
            <Link href="/teacher/dashboard" className="hover:underline">
              Teacher Portal
            </Link>
            <Link href="/admin/dashboard" className="hover:underline">
              Admin Hub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
