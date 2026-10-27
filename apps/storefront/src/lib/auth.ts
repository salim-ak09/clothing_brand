// @ts-nocheck
import NextAuth from "next-auth";

const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Add providers here (e.g. Supabase, Auth0, or Credentials)
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
