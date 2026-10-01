"use client";

import { useUserContext } from "@/context/UserProvider";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenuIcons } from "./DropDownMen";
import { ModeToggle } from "./mode-toggle";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, role, logout } = useUserContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref = role ? `/${role}/dashboard` : "/login";
  const displayName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    user?.email ||
    "User";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/schoolLogo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-md object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            School Management
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>

          {!user && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign up
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href={dashboardHref}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground capitalize"
              >
                {role ? `${role} Dashboard` : "Dashboard"}
              </Link>
              <DropdownMenuIcons>
                <span className="max-w-[140px] truncate">{displayName}</span>
              </DropdownMenuIcons>
            </>
          )}

          <ModeToggle />
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-muted-foreground hover:text-foreground py-1"
          >
            Home
          </Link>
          {!user ? (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground py-1"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground py-1"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                href={dashboardHref}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground py-1 capitalize"
              >
                {role ? `${role} Dashboard` : "Dashboard"}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 py-1 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out ({displayName})</span>
              </button>
            </>
          )}
          <div className="pt-2 flex items-center justify-between border-t border-border">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ModeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
