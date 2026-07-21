import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";

// Use the Edge-compatible config (no Node.js modules)
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
