import { authOptions } from "@/lib/auth-option";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
