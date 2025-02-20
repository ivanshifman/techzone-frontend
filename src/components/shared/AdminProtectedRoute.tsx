"use client";

import { useRouter } from "next/navigation";
import { useAuthRedirect } from "../Hooks/useAuthRedirect";
import { useEffect } from "react";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthRedirect((user) =>
    Boolean(user?.email && user?.type === "admin")
  );

  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (user?.type !== "admin") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user?.email || user?.type !== "admin") return null;

  return <>{children}</>;
};

export default AdminProtectedRoute;
