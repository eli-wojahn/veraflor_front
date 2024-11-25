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
        // Remova o callback redirect
        // async redirect({ url, baseUrl }) {
        //     return '/credenciamento-social';
        // },
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
