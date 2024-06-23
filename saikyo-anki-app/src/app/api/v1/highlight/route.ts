import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {

  // 一旦 bearer token で認証する
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader && authHeader.split(" ")[1];
  if (!bearerToken || bearerToken !== process.env.API_SECRET_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const { email, wordId } = await req.json();
  if (!email || !wordId) {
    return NextResponse.json({ error: "Email and wordId are required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const createdHighlight = await prisma.highlight.create({
    data: {
      userId: user.id,
      wordId,
    },
  });


  return NextResponse.json(createdHighlight);
};