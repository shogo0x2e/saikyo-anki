import openai from "@/lib/openai";

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

  const { word } = await req.json();
  if (!word) {
    return NextResponse.json({ error: "Word is required" }, { status: 400 });
  }

  const chatCompletion = await openai.chat.completions.create({
    messages: [...fewShotPrompts, { role: "user", content: word }],
    model: "gpt-4o",
  });

  return NextResponse.json({
    message: chatCompletion.choices[0].message.content,
  });
};
