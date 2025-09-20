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

// --- DYNAMIC FILTER CONFIGURATION ---
// In a real app, you might fetch this config from your database as well.
// We are basing this on your `hba-schema.json`.
const filterConfig = {
  hba: [
    {
      id: "vendor",
      name: "Vendor",
      type: "checkbox",
      options: ["LSI", "Broadcom", "Dell", "HP", "Intel", "Mellanox"],
    },
    {
      id: "controller_mode",
      name: "Controller Mode",
      type: "radio",
      options: ["SAS", "FC", "CNA"],
    },
    {
      id: "pcie.generation",
      name: "PCIe Generation",
      type: "slider",
      min: 2,
      max: 5,
      step: 1,
    },
    {
      id: "form_factor",
      name: "Form Factor",
      type: "checkbox",
      options: ["Low Profile", "Full Height"],
    },
  ],
  // You would define similar configurations for other categories
  "network-switch": [
    /* ... network switch filters ... */
  ],
  "micro-computer": [
    /* ... micro computer filters ... */
  ],
};

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
          <Label>Min Generation: {value || filter.min}</Label>
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

  // Use a memoized query to prevent re-fetching on every render
  const listings = useQuery(
    api.listings.search,
    // Only run query if categorySlug is available
    categorySlug
      ? { categoryName: categorySlug, filters: selectedFilters }
      : "skip",
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
        filterConfig.hba.find((f) => f.id === filterId)?.type === "checkbox"
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

  const currentFilters =
    filterConfig[categorySlug as keyof typeof filterConfig] || [];

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
          <h2 className="text-2xl font-semibold lowercase mb-4">
            Products ({listings?.length ?? 0} found)
          </h2>
          {listings === undefined && <div>Loading...</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings && listings.length === 0 && (
              <p className="text-muted-foreground col-span-full">
                No products found matching your criteria.
              </p>
            )}
            {listings?.map((listing: any) => (
              <Card key={listing._id} className="p-4">
                <CardTitle>{listing.title}</CardTitle>
                <CardDescription>{listing.description}</CardDescription>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
