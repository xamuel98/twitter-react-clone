interface AuthProviderOptions {
    clientId?: any,
    clientSecret?: string
}

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider<AuthProviderOptions>({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        // ...add more providers here
    ],
    callbacks: {
        async session({ session, token }: any) {
            session.user.tag = session.user.name.split(" ").join("").toLocaleLowerCase();
            session.user.uid = token.sub;
            
            return session; // The return type will match the one returned in `useSession()`
        },
    },
})