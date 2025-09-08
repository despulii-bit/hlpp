"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const hardwareCategories = [
  { label: "hba", value: "hba" },
  // add more categories here as needed
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(
    hardwareCategories[0].value,
  );

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
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="lowercase min-w-[120px]">
              {selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {hardwareCategories.map((cat) => (
              <DropdownMenuItem
                key={cat.value}
                className="lowercase"
                onSelect={() => setSelectedCategory(cat.value)}
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
