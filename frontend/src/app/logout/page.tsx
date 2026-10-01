"use client";

import { useEffect, useRef } from "react";
import { useUserContext } from "@/context/UserProvider";
import { SpinnerSize } from "@/components/Spinners/Spiner";

export default function LogoutPage() {
  const { logout } = useUserContext();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (err: unknown) {
        console.error("Logout error:", err);
      }
    };

    doLogout();
  }, [logout]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-3">
      <SpinnerSize />
    </div>
  );
}
