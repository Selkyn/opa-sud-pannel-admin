"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // console.log("🔒 Redirection forcée vers /auth (non authentifié)");
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Chargement...</p>; // ✅ Ajoute un état de chargement temporaire
  }

  return <>{children}</>;
}
