"use client";

import { useParams } from "next/navigation";
import { useQuery, useAction } from "convex/react"; // Added useAction
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
export default function ItemDetailPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const itemId = params.itemId as string;

  const generateLink = useAction(api.links.generateAffiliateLink);
  const [generatedAffiliateUrl, setGeneratedAffiliateUrl] = useState<
    string | null
  >(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const item = useQuery(
    api.listings.getListingById,
    itemId ? { id: itemId } : "skip",
  );

  useEffect(() => {
    const fetchAffiliateLink = async () => {
      if (item?.store_code && item.product_id) {
        setIsGeneratingLink(true);
        try {
          const url = await generateLink({
            store_code: item.store_code,
            product_id: item.product_id,
          });
          setGeneratedAffiliateUrl(url);
        } catch (error) {
          console.error(
            `Failed to generate affiliate link for ${item.store_code}:`,
            error,
          );
          // Fallback if link generation fails (e.g., store not configured)
          setGeneratedAffiliateUrl(null); // Or a generic fallback URL if available
        } finally {
          setIsGeneratingLink(false);
        }
      } else {
        setGeneratedAffiliateUrl(null); // No store_code or product_id to generate a link
      }
    };

    if (item) {
      fetchAffiliateLink();
    }
  }, [item, generateLink]);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
        <h1 className="text-4xl font-normal lowercase mb-8">
          Loading item details...
        </h1>
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
            <CardDescription className="text-xl">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.specs && Object.keys(item.specs).length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold lowercase mb-3">
                    Specifications
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {Object.entries(item.specs).map(([key, value]) => (
                      <li key={key} className="text-lg">
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>{" "}
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-semibold lowercase mb-3">
                  Available On
                </h3>
                <div className="flex flex-wrap gap-3">
                  {isGeneratingLink ? (
                    <span className="text-muted-foreground lowercase">
                      Generating link...
                    </span>
                  ) : generatedAffiliateUrl ? (
                    <Link
                      href={generatedAffiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "lowercase",
                      )}
                    >
                      {item.store_code} - Buy Now!
                    </Link>
                  ) : (
                    <span className="text-muted-foreground lowercase">
                      Affiliate link not available.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold lowercase mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="lowercase text-base"
                    >
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
