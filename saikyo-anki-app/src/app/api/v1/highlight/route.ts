import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // 一旦 bearer token で認証する
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader && authHeader.split(" ")[1];
  if (!bearerToken || bearerToken !== process.env.API_SECRET_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, wordId, url } = await req.json();
  if (!email || !wordId) {
    return NextResponse.json(
      { error: "Email and wordId are required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const specifiedWord = await prisma.word.findUnique({
    where: {
      id: wordId,
    },
  });

  if (!specifiedWord) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }

  const existingHighlight = await prisma.highlight.findUnique({
    where: {
      userId_wordId: {
        userId: user.id,
        wordId,
      },
    },
  });

  if (existingHighlight) {
    return NextResponse.json(
      { error: "Highlight already exists" },
      { status: 400 },
    );
  }

  const createdHighlight = await prisma.highlight.create({
    data: {
      userId: user.id,
      wordId: specifiedWord.id,
    },
  });

  await prisma.searchLog.create({
    data: {
      highlightId: createdHighlight.id,
      url: url ?? "no url",
    },
  });

  return NextResponse.json(createdHighlight);
};
