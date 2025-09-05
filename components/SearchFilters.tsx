"use client";

import React from "react";

const SearchFilters = () => {
  return (
    <div className="p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      {/* Price Range Slider */}
      <div className="mb-4">
        <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
          Price Range
        </label>
        <input type="range" id="priceRange" name="priceRange" min="0" max="1000" className="w-full" />
      </div>
      {/* Brand Checkboxes */}
      <div>
        <h3 className="text-md font-semibold mb-2">Brand</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input type="checkbox" id="brand-a" name="brand-a" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label htmlFor="brand-a" className="ml-2 block text-sm text-gray-900">
              Brand A
            </label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="brand-b" name="brand-b" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label htmlFor="brand-b" className="ml-2 block text-sm text-gray-900">
              Brand B
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
