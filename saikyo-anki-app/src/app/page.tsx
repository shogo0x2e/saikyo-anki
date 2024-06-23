import prisma from "@/lib/prisma";
import WordsList from "@/components/home/words-list";
import { useRouter } from "next/router";
import { Content } from "next/font/google";

export default async function Home({
  searchParams,
}: {
  searchParams?: { search?: string; sort?: string };
}) {
  const search = searchParams?.search;
  const sort = searchParams?.sort;
  const userId = "clxqbwc4q0000ita3ad8w5gnx";
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
      include: {
        word: true,
        searchLogs: true,
      },
    });
    Highlights.sort((a, b) => {
      const aEarliestDate = Math.min(
        ...a.searchLogs.map((a: any) => new Date(a.createdAt).getTime()),
      );
      const bEarliestDate = Math.min(
        ...b.searchLogs.map((b: any) => new Date(b.createdAt).getTime()),
      );
      return aEarliestDate - bEarliestDate;
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
        time={["2024-06-22T16:22:48.188Z", "2024-06-22T16:22:48.188Z"]}
      />
    </main>
  );
}
