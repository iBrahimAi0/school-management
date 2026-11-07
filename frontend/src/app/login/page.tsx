"use client";

import { StudentLogin } from "@/components/LoginForm";
import { useUserContext } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SpinnerSize } from "@/components/Spinners/Spiner";

export default function LoginPage() {
  const { user, role, loader } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loader && user && role) {
      const userRole = role.toLowerCase();
      if (userRole === "admin") {
        router.replace("/admin/dashboard");
      } else if (userRole === "teacher") {
        router.replace("/teacher/dashboard");
      } else if (userRole === "parent") {
        router.replace("/parent/dashboard");
      } else if (userRole === "student") {
        router.replace("/student/dashboard");
      }
    }
  }, [user, role, loader, router]);

  if (loader) {
    return (
      <div className="flex flex-1 min-h-[calc(100vh-4rem)] items-center justify-center">
        <SpinnerSize />
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <StudentLogin />
    </div>
  );
}
