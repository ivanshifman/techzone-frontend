"use client";

import { useAuthRedirect } from "../Hooks/useAuthRedirect";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthRedirect((user) => !!user?.email);

  if (!user?.email) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
