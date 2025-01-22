import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    withCredentials: true, // Inclut les cookies dans les requêtes
});

let cachedCsrfToken = null; // Cache pour le token CSRF

// Récupérer et ajouter le token CSRF à chaque requête
api.interceptors.request.use(async (config) => {
    if (['post', 'put', 'delete'].includes(config.method)) {
        // Récupère le cookie CSRF
        const csrfToken = Cookies.get('_csrf'); // Lis le cookie _csrf
        console.log("CSRF Token récupéré du cookie :", csrfToken);

        if (!csrfToken) {
            console.error("Aucun token CSRF trouvé dans les cookies !");
            return Promise.reject(new Error("Token CSRF manquant"));
        }

        config.headers['CSRF-Token'] = csrfToken; // Ajoute le token CSRF à l'en-tête
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})

// Gère les erreurs de réponse
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            console.error("Erreur CSRF détectée :", error.response.data.message);
        }
        return Promise.reject(error);
    }
);

export default api;
