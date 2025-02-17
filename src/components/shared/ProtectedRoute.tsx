"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppContext();

  const user = state?.user;
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (!user || !user?.email) {
      router.replace("/auth");
    }
    console.log("usermm", user);
  }, [user, router]);

  if (!user?.email) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
