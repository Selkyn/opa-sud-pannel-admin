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
        // Récupère le token CSRF depuis l'API
        if (!cachedCsrfToken) {
            try {
                const response = await api.get('/csrf-token'); // Appelle l'endpoint pour obtenir le token
                cachedCsrfToken = response.data.csrfToken; // Stocke le token récupéré
            } catch (error) {
                console.error("Erreur lors de la récupération du token CSRF :", error);
                return Promise.reject(error);
            }
        }
        config.headers['CSRF-Token'] = cachedCsrfToken; // Ajoute le token à l'en-tête
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

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
