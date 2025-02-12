"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Context } from "../../context";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const {
    state,
  } = useContext(Context);

  const user = state.user?.user
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (!user || !user.email) {
      router.replace("/auth");
    }
  }, [user, router]);

  if (!user?.email) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
