// hooks/useAuth.ts

"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "loading") {
      // Authentication status is loading
      return;
    }

    if (!session) {
      // Not authenticated, redirect to sign-in page with callbackUrl
      router.replace(
        `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`
      );
      setIsAuthenticated(false);
    } else {
      // Authenticated
      setIsAuthenticated(true);
    }
  }, [session, status, router, pathname]);

  return { session, status, isAuthenticated };
}
