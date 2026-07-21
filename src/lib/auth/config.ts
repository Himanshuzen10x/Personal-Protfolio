import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Edge-compatible auth config.
 * This file MUST NOT import any Node.js-only modules (better-sqlite3, path, etc.)
 * It is imported by middleware which runs in Edge Runtime.
 * 
 * The authorize callback uses dynamic imports for Node.js modules,
 * but the bundler still tries to resolve them for Edge.
 * So we declare the provider with a placeholder authorize and
 * override it in auth.ts (Node.js only file).
 */
export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // authorize is defined in auth.ts (Node.js only)
      // This placeholder is needed for the Edge-compatible config
      authorize: () => null,
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/login";

      if (isOnAdmin && !isOnLogin) {
        if (!isLoggedIn) return false;
        return true;
      }

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
