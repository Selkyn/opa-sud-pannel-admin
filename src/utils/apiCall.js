import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    withCredentials: true, // Inclut les cookies dans toutes les requêtes
});

let cachedCsrfToken = null; // Cache pour le token CSRF
let isRefreshing = false; // Empêche les appels simultanés au refresh token
let failedRequestsQueue = []; // Gère les requêtes en attente pendant le refresh
let isLoggedOut = false;

// **Intercepteur pour ajouter le token CSRF dans les requêtes**
api.interceptors.request.use(
    async (config) => {
        // Ajouter le token CSRF pour les méthodes sensibles (POST, PUT, DELETE)
        if (['post', 'put', 'delete'].includes(config.method)) {
            if (!cachedCsrfToken) {
                try {
                    const response = await api.get('/csrf-token'); // Appel pour récupérer le CSRF token
                    cachedCsrfToken = response.data.csrfToken; // Stocke le token en cache
                } catch (error) {
                    console.error("Erreur lors de la récupération du token CSRF :", error);
                    return Promise.reject(error);
                }
            }
            config.headers['CSRF-Token'] = cachedCsrfToken; // Ajoute le token CSRF à l'en-tête
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// **Intercepteur pour gérer les erreurs de réponse et le refresh token**
api.interceptors.response.use(
    (response) => response, // ✅ Laisse passer les réponses valides
    async (error) => {
        const originalRequest = error.config;

        // ✅ Empêche toute tentative de refresh si l'utilisateur s'est déconnecté
        if (isLoggedOut) {
            // console.log("🔒 L'utilisateur est déconnecté, arrêt du refresh token.");
            return Promise.reject(error);
        }

        // ✅ Vérifie si le backend indique que le token est expiré et nécessite un refresh
        if (error.response?.status === 401 && error.response?.data?.refreshRequired) {
            // console.log("⚠️ JWT Expiré - Tentative de rafraîchissement...");

            originalRequest._retry = true; // ✅ Évite les boucles infinies

            if (isRefreshing) {
                // console.log("Refresh déjà en cours, ajout à la file d'attente...");
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                // console.log("🔄 Appel à /auth/refreshTokenWeb...");
                await api.post('/auth/refreshTokenWeb');
                // console.log("✅ Token rafraîchi avec succès.");

                failedRequestsQueue.forEach((req) => req.resolve());
                failedRequestsQueue = [];
                isRefreshing = false;

                // ✅ Relance la requête initiale après refresh
                return api(originalRequest);
            } catch (refreshError) {
                // console.error("❌ Erreur lors du rafraîchissement :", refreshError);
                failedRequestsQueue.forEach((req) => req.reject(refreshError));
                failedRequestsQueue = [];
                isRefreshing = false;

                // ✅ Si le refresh échoue, on déconnecte l'utilisateur proprement
                // console.log("❌ Refresh échoué - Déconnexion forcée.");
                isLoggedOut = true; // ✅ Bloque toute autre tentative de refresh

                if (typeof window !== "undefined") {
                    const { logout } = require("../context/AuthContext").useAuth();
                    logout();
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ✅ Supprimer l’intercepteur après déconnexion
const removeRefreshInterceptor = () => {
    api.interceptors.response.eject(api.interceptors.response.handlers.length - 1);
    // console.log("🚫 Intercepteur supprimé après déconnexion.");
};

// ✅ Exporter `removeRefreshInterceptor`
export { removeRefreshInterceptor };

// **Intercepteur pour gérer les erreurs de réponse et le refresh token**
// api.interceptors.response.use(
//     (response) => response, // Laisse passer les réponses réussies
//     async (error) => {
//         const originalRequest = error.config;

//         // Si une erreur 401 est détectée et qu'il ne s'agit pas déjà d'une tentative de refresh
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true; // Empêche les boucles infinies
//             console.log("ERRRRRRRRRRRRRRRRRRRRRRRORRRRR 401")
//             // Si un refresh est déjà en cours, attendre sa résolution
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedRequestsQueue.push({ resolve, reject });
//                 })
//                     .then(() => api(originalRequest)) // Relancer la requête initiale
//                     .catch((err) => Promise.reject(err));
//             }

//             isRefreshing = true;

//             try {
//                 // Appel au backend pour rafraîchir le token
//                 await api.post('/auth/refreshTokenWeb'); // Ce point renvoie un nouveau JWT

//                 // Succès : vider la file d'attente des requêtes échouées
//                 failedRequestsQueue.forEach((req) => req.resolve());
//                 failedRequestsQueue = []; // Réinitialiser la file
//                 isRefreshing = false;

//                 return api(originalRequest); // Relancer la requête initiale
//             } catch (refreshError) {
//                 console.error("Erreur lors du rafraîchissement du token :", refreshError);

//                 // Échec : rejeter toutes les requêtes en attente
//                 failedRequestsQueue.forEach((req) => req.reject(refreshError));
//                 failedRequestsQueue = [];
//                 isRefreshing = false;

//                 return Promise.reject(refreshError); // Forcer la reconnexion
//             }
//         }

//         return Promise.reject(error); // Rejeter les autres erreurs
//     }
// );



// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;
  
//       if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
  
//         try {
//           // Rafraîchir le token
//           const { data } = await api.post('/auth/refreshTokenWeb'); // Le cookie `refreshToken` est automatiquement envoyé
//           console.log("✅ Nouveau access token reçu :", data.accessToken);
  
//           // Ajouter le nouveau token à l'en-tête de la requête originale
//           originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
  
//           // Relancer la requête originale
//           return api(originalRequest);
//         } catch (refreshError) {
//           console.error("❌ Échec du rafraîchissement :", refreshError);
//           window.location.href = '/auth'; // Rediriger en cas d'échec
//           return Promise.reject(refreshError);
//         }
//       }
  
//       return Promise.reject(error);
//     }
//   );
  

export default api;