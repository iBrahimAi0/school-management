import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getDashboardUrl(role: string | undefined, baseUrl: string) {
  if (role === "admin") return new URL("/admin/dashboard", baseUrl);
  if (role === "teacher") return new URL("/teacher/dashboard", baseUrl);
  if (role === "parent") return new URL("/parent/dashboard", baseUrl);
  if (role === "student") return new URL("/student/dashboard", baseUrl);
  return new URL("/login", baseUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const role = request.cookies.get("user_role")?.value;
  const isAuthPage = pathname === "/login";
  const isAdminPath = pathname.startsWith("/admin");
  const isTeacherPath = pathname.startsWith("/teacher");
  const isParentPath = pathname.startsWith("/parent");
  const isStudentPath = pathname.startsWith("/student");

  // Unauthenticated users attempting to access protected sections
  if (
    !role &&
    (isAdminPath || isTeacherPath || isParentPath || isStudentPath)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated user attempting to revisit the login page
  if (role && isAuthPage) {
    return NextResponse.redirect(getDashboardUrl(role, request.url));
  }

  // Enforce perimeter boundary isolation per role
  if (isAdminPath && role !== "admin") {
    return NextResponse.redirect(getDashboardUrl(role, request.url));
  }
  if (isTeacherPath && role !== "teacher") {
    return NextResponse.redirect(getDashboardUrl(role, request.url));
  }
  if (isParentPath && role !== "parent") {
    return NextResponse.redirect(getDashboardUrl(role, request.url));
  }
  if (isStudentPath && role !== "student") {
    return NextResponse.redirect(getDashboardUrl(role, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/teacher/:path*",
    "/parent/:path*",
    "/student/:path*",
  ],
};
