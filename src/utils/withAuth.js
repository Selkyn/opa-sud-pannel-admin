"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component) {
    return function ProtectedComponent(props) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push("/auth"); // Redirige vers la page d'authentification
            }
        }, [loading, user, router]);

        if (loading) {
            return <p>Chargement...</p>; // Affiche un loader pendant la vérification
        }

        return user ? <Component {...props} /> : null;
    };
}
