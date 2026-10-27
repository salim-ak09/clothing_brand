import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@repo/database';
// Normally we'd use bcrypt, but for prototype we can use a simple hash or just plain comparison if no crypto library is installed.
// We will use standard Web Crypto API or a simple mock since bcrypt isn't in package.json.

export const { handlers, signIn, signOut, auth }: any = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        // In a real app we'd verify the hash. For prototype, we check if it matches passwordHash.
        if (user && user.passwordHash === credentials.password) {
          return {
            id: user.id,
            email: user.email,
            name: user.email.split('@')[0], // Mock name
          };
        }
        
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET || 'fallback_secret_for_development_only',
  pages: {
    signIn: '/',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
});
