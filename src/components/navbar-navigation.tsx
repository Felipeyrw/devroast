"use client";

import { usePathname } from "next/navigation";
import { NavbarLink } from "@/components/ui/navbar";

export function NavbarNavigation() {
  const pathname = usePathname();
  const isLeaderboard = pathname === "/leaderboard";

  return (
    <NavbarLink href={isLeaderboard ? "/" : "/leaderboard"}>
      {isLeaderboard ? "home" : "leaderboard"}
    </NavbarLink>
  );
}
