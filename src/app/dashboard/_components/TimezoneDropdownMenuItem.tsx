"use client";

import Link from "next/link";
import { createURL } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function TimezoneDropdownMenuItem({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <DropdownMenuItem asChild>
      <Link
        href={createURL("/dashboard/analytics", searchParams, {
          timezone: userTimezone,
        })}
      >
        {userTimezone}
      </Link>
    </DropdownMenuItem>
  );
}
