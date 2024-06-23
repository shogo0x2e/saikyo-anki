import openai from "@/lib/openai";
import prisma from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const fewShotPrompts: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      "user が入力する言葉について簡単に簡潔に説明してください。また、その説明は1文でできるようにしてください。",
  },
  {
    role: "user",
    content: "Next.js",
  },
  {
    role: "assistant",
    content:
      "Reactベースのウェブアプリケーションフレームワーク。サーバーサイドレンダリング、静的サイト生成、ルーティングなどの機能を提供し、高速で SEO に優れたウェブサイトの構築を可能にする。",
  },
  {
    role: "user",
    content: "Unity",
  },
  {
    role: "assistant",
    content:
      "2D・3Dゲーム開発のためのプラットフォーム。マルチプラットフォーム対応、直感的なインターフェース、豊富なアセットストアが特徴である。",
  },
];

export const POST = async (req: NextRequest) => {
  // 一旦 bearer token で認証する
  const authHeader = req.headers.get("Authorization");
  const bearerToken = authHeader && authHeader.split(" ")[1];
  if (!bearerToken || bearerToken !== process.env.API_SECRET_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { word, email, url } = await req.json();
  if (!word || !email) {
    return NextResponse.json(
      { error: "Word or email is required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const chatCompletion = await openai.chat.completions.create({
    messages: [...fewShotPrompts, { role: "user", content: word }],
    model: "gpt-4o",
  });

  const aiExplanation = chatCompletion.choices[0].message.content;
  if (!aiExplanation) {
    return NextResponse.json(
      { error: "Failed to generate AI explanation" },
      { status: 500 },
    );
  }

  const existingWord = await prisma.word.findUnique({
    where: {
      content: word,
    },
  });

  if (!existingWord) {
    const createdWord = await prisma.word.create({
      data: {
        content: word,
        aiExplanation,
      },
    });

    return NextResponse.json(createdWord);
  }

  // highlight と search_log を作成する
  const existingHighlight = await prisma.highlight.findFirst({
    where: {
      userId: user.id,
      wordId: existingWord.id,
    },
  });

  if (existingHighlight) {
    await prisma.searchLog.create({
      data: {
        highlightId: existingHighlight.id,
        url: url ?? "no url",
      },
    });

    await prisma.highlight.update({
      where: {
        id: existingHighlight.id,
      },
      data: {
        lastHighlightedAt: new Date(),
      },
    });
  }

  return NextResponse.json(existingWord);
};
