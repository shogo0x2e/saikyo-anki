import prisma from "@/lib/prisma";
import WordsList from "@/components/home/words-list";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-option";

export default async function Home({
  searchParams,
}: {
  searchParams?: { search?: string; sort?: string };
}) {
  const search = searchParams?.search;
  const sort = searchParams?.sort;
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return <>ログインしてぐたさい</>;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
  });
  if (!user) {
    return <>ログインしてください</>;
  }
  const userId = user.id;
  let Words: any[] = [],
    Highlights: any[] = [],
    SearchLogs: any[] = [];

  if (sort === "update-time") {
    Highlights = await prisma.highlight.findMany({
      where: {
        userId: userId,
        word: {
          OR: [
            { content: { contains: search, mode: "insensitive" } },
            //{ aiExplanation: { contains: search, mode: "insensitive" } },
          ],
        },
      },
      orderBy: {
        lastHighlightedAt: "asc",
      },
      include: {
        word: true,
        searchLogs: true,
      },
    });
    Words = Highlights.map((highlight) => highlight.word);
    //console.log(Words);
  } else if (sort === "number-of-searches") {
    Highlights = await prisma.highlight.findMany({
      where: {
        userId: userId,
        word: {
          OR: [
            { content: { contains: search, mode: "insensitive" } },
            //{ aiExplanation: { contains: search, mode: "insensitive" } },
          ],
        },
      },
      include: {
        word: true,
        searchLogs: true,
      },
    });

    Highlights.sort((a, b) => b.searchLogs.length - a.searchLogs.length);
    Words = Highlights.map((highlight) => highlight.word);
  } else {
    Highlights = await prisma.highlight.findMany({
      where: {
        userId: userId,
        word: {
          OR: [
            { content: { contains: `${search}`, mode: "insensitive" } },
            //{ aiExplanation: { contains: `${search}`, mode: "insensitive" } },
          ],
        },
      },
      include: {
        word: true,
        searchLogs: true,
      },
    });
    Highlights.sort((a, b) => {
      const contentA = a.word.content.toLowerCase();
      const contentB = b.word.content.toLowerCase();
      if (contentA < contentB) return -1;
      if (contentA > contentB) return 1;
      return 0;
    });
    Words = Highlights.map((highlight) => highlight.word);
  }

  return (
    <main className="flex-grow flex justify-center lg:mx-8 h-main">
      <WordsList
        words={Words}
        number={Highlights.map((highlight) => highlight.searchLogs.length)}
        time={Highlights.map((highlight) => highlight.lastHighlightedAt)}
      />
    </main>
  );
}
