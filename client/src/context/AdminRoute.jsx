"use client";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.isAdmin) router.push("/");
  }, [user, router]);

  if (!user || !user.isAdmin) {
    return null;
  }

  return <>{children}</>;
};
