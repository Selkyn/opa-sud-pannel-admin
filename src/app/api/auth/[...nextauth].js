import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post("http://localhost:4000/api/auth/login", {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const user = response.data;

                    if (user.token) {
                        return user; // Retourne l'utilisateur si valide
                    }

                    return null; // Retourne null si la connexion échoue
                } catch (error) {
                    console.error("Erreur lors de l'authentification :", error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.email = token.email;
            return session;
        },
    },
});
