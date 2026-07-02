import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.verificationStatus = (user as { verificationStatus?: string }).verificationStatus;
        token.firstName = (user as { firstName?: string }).firstName;
        token.lastName = (user as { lastName?: string }).lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: unknown }).id = token.id;
        (session.user as { role?: unknown }).role = token.role;
        (session.user as { verificationStatus?: unknown }).verificationStatus = token.verificationStatus;
        (session.user as { firstName?: unknown }).firstName = token.firstName;
        (session.user as { lastName?: unknown }).lastName = token.lastName;
      }
      return session;
    },
  },
  providers: [], // Providers requiring Node modules are added in auth.ts
} satisfies NextAuthConfig;
