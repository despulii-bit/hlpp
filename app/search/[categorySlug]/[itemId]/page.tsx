"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ItemDetailPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const itemId = params.itemId as string;

  const item = useQuery(api.listings.getListingById, itemId ? { id: itemId } : "skip");

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
        <h1 className="text-4xl font-normal lowercase mb-8">Loading item details...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-background text-foreground">
      <div className="w-full max-w-4xl">
        <Link
          href={`/search/${categorySlug}`}
          className={cn(buttonVariants({ variant: "ghost" }), "mb-4 lowercase")}
        >
          &larr; Back to {categorySlug.replace(/-/g, " ")}
        </Link>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-4xl lowercase">{item.title}</CardTitle>
            <CardDescription className="text-xl">{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.specs && Object.keys(item.specs).length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold lowercase mb-3">Specifications</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {Object.entries(item.specs).map(([key, value]) => (
                      <li key={key} className="text-lg">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{" "}
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.availability && item.availability.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold lowercase mb-3">Available On</h3>
                  <div className="flex flex-wrap gap-3">
                    {item.availability.map((platform: any, index: number) => (
                      <Link
                        key={index}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline" }), "lowercase")}
                      >
                        {platform.site} - ${platform.price?.toFixed(2) || "N/A"}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold lowercase mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="lowercase text-base">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
