// app/search/page.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SearchFilters from "@/components/SearchFilters";

const mockProducts = [
  {
    name: "Raspberry Pi 4",
    imageUrl: "/file.svg",
    retailer: "Adafruit",
    externalLink: "https://www.adafruit.com/product/4295",
  },
  {
    name: "Arduino Uno",
    imageUrl: "/file.svg",
    retailer: "SparkFun",
    externalLink: "https://www.sparkfun.com/products/11021",
  },
  {
    name: "NVIDIA Jetson Nano",
    imageUrl: "/file.svg",
    retailer: "NVIDIA",
    externalLink:
      "https://developer.nvidia.com/embedded/jetson-nano-developer-kit",
  },
];

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  // Simulate filtering based on the query
  const filteredProducts = query
    ? mockProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      )
    : mockProducts;

  return (
    <div className="flex">
      <aside className="w-1/4">
        <SearchFilters />
      </aside>
      <main className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for &quot;{query}&quot;
        </h1>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        ) : (
          <div>
            <p>No results found for &quot;{query}&quot;.</p>
            <Link href="/" className="text-blue-500">
              Go back
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResultsPage;
