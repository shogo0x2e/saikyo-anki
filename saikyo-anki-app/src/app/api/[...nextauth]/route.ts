import type { NextApiRequest, NextApiResponse } from "next"
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
  }
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      })
    ]
  });
}