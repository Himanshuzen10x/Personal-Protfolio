import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";
import { authConfig } from "./config";

const dbPath = path.join(process.cwd(), "portfolio.db");

/**
 * Full auth config with Node.js-only modules.
 * This file should ONLY be imported in server components and API routes,
 * NEVER in middleware (use config.ts for middleware).
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const sqlite = new Database(dbPath);
          const user = sqlite.prepare(
            "SELECT * FROM users WHERE username = ?"
          ).get(credentials.username as string) as {
            id: number;
            username: string;
            email: string;
            password_hash: string;
          } | undefined;

          sqlite.close();

          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );

          if (!isValid) {
            return null;
          }

          return {
            id: String(user.id),
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
