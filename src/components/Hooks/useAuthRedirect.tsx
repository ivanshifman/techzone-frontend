"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context";
import { User } from "../../types/context.types";

export const useAuthRedirect = (validateUser: (user: User) => boolean) => {
  const { state } = useAppContext();
  const user = state?.user;
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (!validateUser(user)) {
      router.replace("/auth");
    }
  }, [user, router, validateUser]);

  return user;
};
