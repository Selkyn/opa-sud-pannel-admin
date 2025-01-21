import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    withCredentials: true, // Inclut les cookies dans les requêtes
});

let cachedCsrfToken = null; // Cache pour le token CSRF

// Récupérer et ajouter le token CSRF à chaque requête
api.interceptors.request.use(async (config) => {
    // Récupère le token CSRF seulement si la requête nécessite un POST, PUT ou DELETE
    if (['post', 'put', 'delete'].includes(config.method)) {
        if (!cachedCsrfToken) {
            try {
                const response = await api.get('/csrf-token');
                cachedCsrfToken = response.data.csrfToken; // Stocke le token
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
