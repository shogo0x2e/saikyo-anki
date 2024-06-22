import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const userJohn = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
    },
  });

  const userJane = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
  });

  // Create a word
  await createWords();

  // Create a highlight
  const nextjsWord = await prisma.word.findUniqueOrThrow({
    where: {
      content: "Next.js",
    },
  });

  const unityWord = await prisma.word.findUniqueOrThrow({
    where: {
      content: "Unity",
    },
  });

  const johnNextjsHighlight = await prisma.highlight.create({
    data: {
      userId: userJohn.id,
      wordId: nextjsWord.id,
    },
  });

  const johnUnityHighlight = await prisma.highlight.create({
    data: {
      userId: userJohn.id,
      wordId: unityWord.id,
    },
  });

  const janeUnityHighlight = await prisma.highlight.create({
    data: {
      userId: userJane.id,
      wordId: unityWord.id,
    },
  });

  // Create a search log
  await prisma.searchLog.createMany({
    data: [
      {
        highlightId: johnNextjsHighlight.id,
        url: "https://example.com",
      },
      {
        highlightId: johnUnityHighlight.id,
        url: "https://example.com",
      },
      {
        highlightId: janeUnityHighlight.id,
        url: "https://example.com",
      },
    ],
  });

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function createWords() {
  const words = [
    {
      content: "Next.js",
      aiExplanation:
        "Reactベースのウェブアプリケーションフレームワーク。サーバーサイドレンダリング、静的サイト生成、ルーティングなどの機能を提供し、高速で SEO に優れたウェブサイトの構築を可能にする。",
    },
    {
      content: "Unity",
      aiExplanation:
        "2D・3Dゲーム開発のためのプラットフォーム。マルチプラットフォーム対応、直感的なインターフェース、豊富なアセットストアが特徴である。",
    },
    {
      content: "Docker",
      aiExplanation:
        "コンテナ技術を用いてアプリケーションの開発、デプロイ、実行を簡素化するプラットフォーム。",
    },
    {
      content: "Kubernetes",
      aiExplanation:
        "コンテナ化されたアプリケーションのデプロイ、スケーリング、管理を自動化するオープンソースのシステム。",
    },
    {
      content: "TypeScript",
      aiExplanation:
        "JavaScriptに型付けを追加したプログラミング言語で、大規模なアプリケーションの開発を容易にする。",
    },
  ];

  await prisma.word.createMany({
    data: words,
  });

  console.log("Words created.");
}
