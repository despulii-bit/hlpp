"use client";

import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";

const SearchFilters = () => {
  return (
    <div className="p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      {/* Price Range Slider */}
      <div className="mb-4">
        <Label htmlFor="priceRange">Price Range</Label>
        <Slider id="priceRange" min={0} max={1000} defaultValue={[0, 500]} />
      </div>
      {/* Brand Checkboxes */}
      <div>
        <h3 className="text-md font-semibold mb-2">Brand</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox id="brand-a" />
            <Label htmlFor="brand-a" className="ml-2">
              Brand A
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox id="brand-b" />
            <Label htmlFor="brand-b" className="ml-2">
              Brand B
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
