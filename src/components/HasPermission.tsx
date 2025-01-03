import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import NoPermissionCard from "./NoPermissionCard";

export default async function HasPermission({
  permission,
  renderFallback = false,
  fallbackText,
  children,
}: {
  permission: (userId: string | null) => Promise<boolean>;
  renderFallback?: boolean;
  fallbackText?: string;
  children: ReactNode;
}) {
  const { userId } = await auth();
  const hasPermission = await permission(userId);
  if (hasPermission) return children;

  if (renderFallback)
    return <NoPermissionCard>{fallbackText}</NoPermissionCard>;

  return null;
}