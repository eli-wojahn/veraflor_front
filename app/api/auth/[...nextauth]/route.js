import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // Permite o login
            return true;
        },
        async redirect({ url, baseUrl }) {
            // Redireciona para a página de completar perfil
            return '/credenciamento-social'; // Certifique-se de que o caminho está correto
        },
        async session({ session, user, token }) {
            // Adiciona o ID do usuário à sessão
            session.user.id = token.sub;
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }