"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

//ダミーデータ
import wordsData from "./dumm";
const datas = wordsData;

export default function Home() {
  //コンボボックス
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    console.log("Search");
    console.log(sortVariables);
  }, []);

  return (
    <main className="flexgrow flex justify-center  lg:mx-8 h-main">
      <div className="mt-8">
        <div className="flex flex-wrap mx-8">
          <Input className="w-[240px] mr-auto" placeholder="Search"></Input>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? sortVariables.find(
                      (sortVariable) => sortVariable.value === value
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
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === sortVariable.value
                              ? "opacity-100"
                              : "opacity-0"
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
              <AccordionItem key={index} value={data.word}>
                <AccordionTrigger className="lg:text-2xl text-slate-800 md:text-xl m-1">
                  {data.word}
                </AccordionTrigger>
                <AccordionContent className="lg:text-xl text-slate-700 md:text-base p-2 mb-2 mx-2">
                  {data.definition}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    </main>
  );
}
