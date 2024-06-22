import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient();

const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET as string,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }