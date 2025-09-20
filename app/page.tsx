"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const hardwareCategories = [
  { label: "hba", value: "hba" },
  { label: "network switch", value: "network-switch" },
  { label: "micro computer", value: "micro-computer" },
  // add more categories here as needed
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
    router.push(`/search/${value}`);
  };

  const selectedCategoryLabel =
    hardwareCategories.find((cat) => cat.value === selectedCategory)?.label ||
    "components";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      {/* Top left navigation */}
      <div className="absolute top-4 left-4 flex flex-col items-start space-y-2">
        <div className="flex flex-row space-x-4">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm lowercase hover:underline"
          >
            github
          </a>
          <a
            href="https://discord.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm lowercase hover:underline"
          >
            discord
          </a>
        </div>
        <a href="/pricing" className="text-sm lowercase hover:underline mt-2">
          pricing
        </a>
        <a href="/sign-in" className="text-sm lowercase hover:underline mt-2">
          sign in
        </a>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-5xl font-normal lowercase mb-6 select-none">
          hlpp
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "lowercase min-w-[120px]",
            )}
          >
            {selectedCategoryLabel}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {hardwareCategories.map((cat) => (
              <DropdownMenuItem
                key={cat.value}
                className="lowercase"
                onSelect={() => handleSelectCategory(cat.value)}
              >
                {cat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bottom left footer */}
      <footer className="absolute bottom-4 left-4 text-xs lowercase text-muted-foreground">
        footer
      </footer>
    </div>
  );
}
