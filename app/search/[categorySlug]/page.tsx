"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Import UI Components
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Added Input component

// --- Universal Filter Renderer Component ---
function FilterRenderer({ filter, selectedFilters, onFilterChange }: any) {
  const { id, name, type } = filter;
  const value = selectedFilters[id];

  switch (type) {
    case "checkbox":
      return (
        <div className="space-y-2">
          {filter.options.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${id}-${option}`}
                checked={value?.includes(option) || false}
                onCheckedChange={(checked) =>
                  onFilterChange(id, option, checked)
                }
              />
              <Label
                htmlFor={`${id}-${option}`}
                className="lowercase font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      );
    case "radio":
      return (
        <RadioGroup
          value={value}
          onValueChange={(val) => onFilterChange(id, val, true)}
        >
          {filter.options.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${id}-${option}`} />
              <Label
                htmlFor={`${id}-${option}`}
                className="lowercase font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    case "slider":
      return (
        <div>
          <Label>
            Min {filter.name}: {value || filter.min}
          </Label>
          <Slider
            defaultValue={[filter.min]}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            onValueChange={(val) => onFilterChange(id, val[0], true)}
          />
        </div>
      );
    default:
      return null;
  }
}

export default function CategoryFilterPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;

  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query
  const [sortBy, setSortBy] = useState<string | null>(null); // Added state for sorting column
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Added state for sort order

  // Use a memoized query to prevent re-fetching on every render
  const listings = useQuery(
    api.listings.search,
    // Only run query if categorySlug is available
    categorySlug
      ? {
          categoryName: categorySlug,
          filters: selectedFilters,
          query: searchQuery, // Pass search query to Convex
          sortBy, // Pass sort by column to Convex
          sortOrder, // Pass sort order to Convex
        }
      : "skip",
  );

  const fetchedFilterConfig = useQuery(
    api.listings.getFilterConfig,
    categorySlug ? { categorySlug } : "skip",
  );

  const handleFilterChange = (
    filterId: string,
    value: any,
    isSelected: boolean,
  ) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      const currentFilter = prev[filterId];

      if (
        fetchedFilterConfig?.find((f: any) => f.id === filterId)?.type ===
        "checkbox"
      ) {
        const currentValues = Array.isArray(currentFilter) ? currentFilter : [];
        if (isSelected) {
          newFilters[filterId] = [...currentValues, value];
        } else {
          newFilters[filterId] = currentValues.filter(
            (item: any) => item !== value,
          );
          // If the array is empty, remove the filter key
          if (newFilters[filterId].length === 0) {
            delete newFilters[filterId];
          }
        }
      } else {
        if (isSelected) {
          newFilters[filterId] = value;
        } else {
          delete newFilters[filterId];
        }
      }
      return newFilters;
    });
  };

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const currentFilters = fetchedFilterConfig || [];

  return (
    <div className="min-h-screen flex flex-col items-center p-8 bg-background text-foreground">
      <h1 className="text-4xl font-normal lowercase mb-8">
        Filters for {categorySlug?.replace(/-/g, " ")}
      </h1>

      <div className="flex w-full max-w-7xl">
        {/* Filter Sidebar */}
        <aside className="w-1/4 pr-8">
          <h2 className="text-2xl font-semibold lowercase mb-4">Filters</h2>
          {currentFilters.map((filter) => (
            <Card key={filter.id} className="mb-4 p-4">
              <CardTitle className="text-lg mb-2">{filter.name}</CardTitle>
              <FilterRenderer
                filter={filter}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </Card>
          ))}
        </aside>

        {/* Product Display Area */}
        <main className="w-3/4 pl-8 border-l border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold lowercase">
              Products ({listings?.length ?? 0} found)
            </h2>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/3" // Adjust width as needed for the search bar
            />
          </div>
          {listings === undefined && <div>Loading...</div>}
          <div className="mb-4 flex space-x-4">
            {/* Sortable headers */}
            <button
              onClick={() => handleSortChange("title")}
              className={`font-semibold lowercase px-2 py-1 rounded ${
                sortBy === "title"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              Name {sortBy === "title" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>

            {/* Placeholder for Price - adjust 'price' to the actual spec key if different */}
            <button
              onClick={() => handleSortChange("price")}
              className={`font-semibold lowercase px-2 py-1 rounded ${
                sortBy === "price"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              Price{" "}
              {sortBy === "price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            {listings && listings.length === 0 && (
              <p className="text-muted-foreground">
                No products found matching your criteria.
              </p>
            )}
            {listings?.map((listing: any) => (
              <Link
                key={listing._id}
                href={`/search/${categorySlug}/${listing._id}`}
                className="block hover:shadow-md transition-shadow duration-200"
              >
                <Card className="p-4">
                  <CardTitle>{listing.title}</CardTitle>
                  <CardDescription>{listing.description}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
