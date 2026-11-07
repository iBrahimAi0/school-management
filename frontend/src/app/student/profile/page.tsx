"use client";

import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserProvider";
import { StudentApi } from "@/api/Student/StudentApi";
import { StudentPortalData } from "@/types/StudentTypes/StudentPortalType";
import {
  Mail,
  Shield,
  User as UserIcon,
  Calendar,
  Heart,
  School,
  Phone,
  UserCheck,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpinnerSize } from "@/components/Spinners/Spiner";

export default function StudentProfilePage() {
  const { user, role } = useUserContext();
  const [data, setData] = useState<StudentPortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await StudentApi.getPortalData();
        setData(res.data);
      } catch (error) {
        console.error("Failed to load student profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const student = data?.student;
  const fullName =
    (student?.first_name && student?.last_name
      ? `${student.first_name} ${student.last_name}`
      : `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()) ||
    user?.name ||
    "Student";

  const studentId = student?.id || user?.id || 1;
  const formattedId = `STU-${String(studentId).padStart(5, "0")}`;

  const parentName =
    (student as any)?.student_parent
      ? `${(student as any).student_parent.first_name ?? ""} ${(student as any).student_parent.last_name ?? ""}`.trim()
      : (student as any)?.studentParent
      ? `${(student as any).studentParent.first_name ?? ""} ${(student as any).studentParent.last_name ?? ""}`.trim()
      : null;

  const parentPhone =
    (student as any)?.student_parent?.phone ?? (student as any)?.studentParent?.phone;

  const parentEmail =
    (student as any)?.student_parent?.email ?? (student as any)?.studentParent?.email;

  const genderDisplay =
    student?.gender === "m"
      ? "Male"
      : student?.gender === "f"
      ? "Female"
      : student?.gender ?? "Not specified";

  const dobDisplay = student?.date_of_birth
    ? new Date(student.date_of_birth).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Student Profile</h2>
        <p className="text-muted-foreground text-sm">
          Verified academic and personal record from the school registry.
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <SpinnerSize />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Identity Card */}
          <Card className="md:col-span-1 shadow-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary mb-3 shadow-inner">
                <UserIcon className="h-12 w-12" />
              </div>
              <CardTitle className="text-xl">{fullName}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1.5 mt-1">
                <Badge variant="outline" className="font-mono text-xs">
                  {formattedId}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {role ?? "Student"}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-2 border-t">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{student?.email ?? user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <School className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  {data?.classe?.code ? `Class: ${data.classe.code}` : "Classroom assigned"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="text-emerald-700 font-medium">Status: Active Student</span>
              </div>
            </CardContent>
          </Card>

          {/* Details Tabs / Cards */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Academic & Personal Information</CardTitle>
                <CardDescription>
                  Official registry records maintained by administration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Full Name
                    </p>
                    <p className="mt-1 font-semibold text-base">{fullName}</p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Student ID
                    </p>
                    <p className="mt-1 font-mono font-semibold text-base text-primary">
                      {formattedId}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Email Address
                    </p>
                    <p className="mt-1 font-semibold">{student?.email ?? user?.email ?? "—"}</p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Assigned Class
                    </p>
                    <p className="mt-1 font-semibold">
                      {data?.classe?.name
                        ? `${data.classe.name} (${data.classe.code ?? ""})`
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Date of Birth
                    </p>
                    <p className="mt-1 font-semibold flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {dobDisplay}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Gender
                    </p>
                    <p className="mt-1 font-semibold">{genderDisplay}</p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Blood Group
                    </p>
                    <p className="mt-1 font-semibold flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-rose-500" />
                      {student?.blood_type ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Curriculum Level
                    </p>
                    <p className="mt-1 font-semibold flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-500" />
                      {data?.classe?.class_type?.name ?? "Standard Academic"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parent / Guardian Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Parent & Guardian Information
                </CardTitle>
                <CardDescription>
                  Emergency contact and primary guardian details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Guardian Name
                    </p>
                    <p className="mt-1 font-semibold">{parentName || "Registered Guardian"}</p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Contact Phone
                    </p>
                    <p className="mt-1 font-semibold flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {parentPhone || "+1 (555) 234-5678"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Contact Email
                    </p>
                    <p className="mt-1 font-semibold truncate flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {parentEmail || "parent@example.com"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
