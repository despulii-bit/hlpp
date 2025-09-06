// app/search/page.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SearchFilters from "@/components/SearchFilters";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const listings = useQuery(api.listings.search, { query });

  return (
    <div className="flex">
      <aside className="w-1/4">
        <SearchFilters />
      </aside>
      <main className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for &quot;{query}&quot;
        </h1>
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <ProductCard
                key={listing._id}
                title={listing.title}
                description={listing.description}
                price={listing.price}
              />
            ))}
          </div>
        ) : (
          <div>
            <p>No results found for &quot;{query}&quot;.</p>
            <Button asChild>
              <Link href="/">Go back</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage;
