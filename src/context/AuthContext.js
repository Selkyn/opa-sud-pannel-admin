// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// // Crée un contexte
// const AuthContext = createContext();

// // AuthProvider : Fournit les données d'authentification à l'application
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [logged, setLogged] = useState(false)
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const response = await axios.get("http://localhost:4000/auth/protected", {
//                     withCredentials: true, // Inclut les cookies
//                 });
//                 setUser(response.data.user); // Définir l'utilisateur si authentifié
//             } catch (err) {
//                 setUser(null); // Pas authentifié
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkAuth();
//     }, []);
//     // useEffect(() => {
//     //     if (logged) {
//     //         router.push("/patients"); // Redirection vers /patients si l'utilisateur est connecté
//     //     }
//     // }, [logged, router]);

//     return (
//         <AuthContext.Provider value={{ user, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Hook pour utiliser le contexte d'authentification
// export const useAuth = () => useContext(AuthContext);
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import api, { removeRefreshInterceptor} from '../utils/apiCall';
import { useRouter, usePathname } from "next/navigation";
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Vérifie l'authentification au chargement de l'application
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/auth/check');
                setUser(response.data.user);
            } catch {
                setUser(null);
                router.push('/auth');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // **Forcer la redirection vers /auth si l'utilisateur est déconnecté**
    useEffect(() => {
        if (!loading && user === null && pathname !== '/auth') {
            console.log("🚀 Redirection vers /auth...");
            router.push('/auth');
        }
    }, [loading, user, pathname]);

    const login = async (email, password) => {
        try {
            await api.post('/auth/login', { email, password });
           
            const response = await api.get('/auth/check');


            setUser(response.data.user);
            // router.push('/'); // Redirige après connexion
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Erreur de connexion');
        }
    };

    const logout = async () => {
        try {
        //   console.log("Tentative de déconnexion...");
        //   await axios.post('http://localhost:4000/api/auth/logout', {}, {
        //     withCredentials: true, // Inclut les cookies dans la requête pour permettre au serveur de les supprimer
        //   });
          await axios.post('https://api-opa-sud-selkyn.vercel.app/api/auth/logout', {}, {
            withCredentials: true, // Inclut les cookies dans la requête pour permettre au serveur de les supprimer
          });
        //   await api.post('/auth/logout'); // Supprime le cookie côté serveur
      
        //   // Vérifie immédiatement l'état utilisateur après déconnexion
        //   try {
        //     await api.get('/auth/check', { withCredentials: true });
        //   } catch (error) {
        //     console.log("Utilisateur déconnecté, aucune donnée utilisateur trouvée.");
        //   }
        removeRefreshInterceptor();
          setUser(null); // Réinitialise immédiatement l'état utilisateur
          router.push('/auth'); // Redirige vers la page de connexion
        } catch (err) {
          console.error("Erreur lors de la déconnexion :", err);
        }
      };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

