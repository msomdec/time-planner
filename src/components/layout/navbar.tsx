"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Timelines" },
  { href: "/documents", label: "Documents" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Heart className="w-6 h-6 text-rose-400 group-hover:text-rose-500 transition-colors fill-rose-200" />
            <span className="font-script text-2xl text-rose-500">
              Wedding Planner
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/" || pathname.startsWith("/timelines")
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-rose-100 text-rose-700"
                      : "text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
