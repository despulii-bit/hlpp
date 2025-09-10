"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("q");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <h1 className="text-3xl font-normal lowercase">
        You selected the category:{" "}
        {category ? category : "No category selected"}
      </h1>
    </div>
  );
}
