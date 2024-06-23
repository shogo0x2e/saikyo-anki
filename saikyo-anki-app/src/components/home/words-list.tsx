"use client";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronsDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Word } from "@prisma/client";

const sortVariables = [
  {
    value: "update-time",
    label: "Update-Time",
  },
  {
    value: "number-of-searches",
    label: "Number-Of-Searches",
  },
];

type Props = {
  words: Word[];
  number: number[];
  time: string[];
};

const WordsList = ({
  words: Words,
  number: numberOfSearch,
  time: lastSearchTime,
}: Props) => {
  //コンボボックス
  const [open, setOpen] = useState(false);
  const [comboboxValue, setComboboxValue] = useState("");

  const datas = Words;

  const router = useRouter();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState("");

  function handleInputChanged(input: string, sortVariable: string) {
    setInputValue(input);
  }

  function dateC(date: string) {
    const date0 = new Date(date);
    return date0.toString();
  }

  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set("search", inputValue);
    newParams.set("sort", comboboxValue);
    router.replace(`${pathname}?${newParams.toString()}`);
  }, [inputValue, comboboxValue]);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap mx-8">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChanged(e.target.value, "search")}
          className="w-[240px] mr-auto"
          placeholder="Search"
        ></Input>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {comboboxValue
                ? sortVariables.find(
                    (sortVariable) => sortVariable.value === comboboxValue,
                  )?.label
                : "Select"}
              <ChevronsDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search" />
              <CommandEmpty>No SortVariables found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {sortVariables.map((sortVariable, index) => (
                    <CommandItem
                      key={index}
                      value={sortVariable.value}
                      onSelect={(currentValue) => {
                        setComboboxValue(
                          currentValue === comboboxValue ? "" : currentValue,
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          comboboxValue === sortVariable.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {sortVariable.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <ScrollArea className="m-8 overflow-hidden h-5/6 lg:w-[760px] md:w-[540px] sm:w-[360px] w-[300px] p-4 rounded-md border-slate-300 border">
        <Accordion type="multiple">
          {datas.map((data, index) => (
            <AccordionItem key={index} value={data.content}>
              <AccordionTrigger className="lg:text-2xl text-slate-800 md:text-xl m-1">
                {data.content}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col lg:text-xl text-slate-700 md:text-base p-2 mb-2 mx-2">
                <div>{data.aiExplanation}</div>
                <div className="flex flex-row mt-2 text-sm">
                  <div className="mr-4 ml-auto text-slate-400">
                    {dateC(lastSearchTime[index])}
                  </div>
                  <div className="text-slate-400">{`${numberOfSearch[index]} Searched`}</div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default WordsList;
