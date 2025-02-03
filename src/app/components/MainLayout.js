"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "./header";
import Footer from "./footer";

export default function MainLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/auth") {
        console.log("Utilisateur déconnecté. Redirection vers /auth...");

      router.push("/auth"); // Redirige vers /auth si non connecté
    }
  }, [user, loading, pathname, router]);

  if (loading || (!user && pathname !== "/auth")) {
    // Ne rien rendre tant que la vérification est en cours ou que la redirection n'a pas eu lieu
    return <div>Chargement...</div>; // Affiche un loader
  }
  return <>{children}</>;
}
