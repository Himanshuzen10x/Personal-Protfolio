import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./config";

/**
 * Full auth config with database access.
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
          // Dynamic imports to keep this compatible
          const { db } = await import("@/lib/db");
          const { users } = await import("@/lib/db/schema");
          const { eq } = await import("drizzle-orm");
          const bcrypt = (await import("bcryptjs")).default;

          const result = await db
            .select()
            .from(users)
            .where(eq(users.username, credentials.username as string))
            .limit(1);

          const user = result[0];

          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
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
