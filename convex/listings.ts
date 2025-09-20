import { query } from "./_generated/server";
import { v } from "convex/values";

export const search = query({
  args: {
    categoryName: v.string(),
    filters: v.optional(v.any()),
    // Make the text query optional so you can filter without it
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.categoryName) {
      return [];
    }

    let listings = await ctx.db
      .query("listings")
      .withIndex("by_category", (q) => q.eq("category", args.categoryName))
      .collect();

    if (args.filters) {
      listings = listings.filter((listing) => {
        const specs = listing.specs as Record<string, any>;
        for (const filterKey in args.filters) {
          const filterValue = args.filters[filterKey];
          // Simple exact match filtering
          if (specs[filterKey] !== filterValue) {
            return false;
          }
        }
        return true;
      });
    }

    if (args.query) {
      const lowerCaseQuery = args.query.toLowerCase();
      listings = listings.filter(
        (listing: any) =>
          listing.title.toLowerCase().includes(lowerCaseQuery) ||
          listing.description.toLowerCase().includes(lowerCaseQuery),
      );
    }

    return listings;
  },
});

export const getFilterConfig = query({
  args: {
    categorySlug: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.categorySlug) {
      return [];
    }

    const listings = await ctx.db
      .query("listings")
      .withIndex("by_category", (q) => q.eq("category", args.categorySlug))
      .collect();

    const vendorOptions = new Set<string>();
    const controllerModeOptions = new Set<string>();
    const pcieGenerations: number[] = [];
    const formFactorOptions = new Set<string>();

    for (const listing of listings) {
      const specs = listing.specs as Record<string, any>;

      if (specs.controller) {
        vendorOptions.add(specs.controller);
      }
      if (specs.controller_mode) {
        controllerModeOptions.add(specs.controller_mode);
      }
      if (
        specs.pcie?.generation !== undefined &&
        typeof specs.pcie.generation === "number"
      ) {
        pcieGenerations.push(specs.pcie.generation);
      }
      if (specs.form_factor) {
        formFactorOptions.add(specs.form_factor);
      }
    }

    const filterConfig: any[] = [];

    // Assuming these are the desired filters for 'hba' category based on page.tsx
    // You can extend this logic for other categories as needed.
    if (args.categorySlug === "hba") {
      if (vendorOptions.size > 0) {
        filterConfig.push({
          id: "controller", // Changed from 'vendor' to 'controller' to match actual spec field
          name: "Vendor",
          type: "checkbox",
          options: Array.from(vendorOptions).sort(),
        });
      }

      if (controllerModeOptions.size > 0) {
        filterConfig.push({
          id: "controller_mode",
          name: "Controller Mode",
          type: "radio",
          options: Array.from(controllerModeOptions).sort(),
        });
      }

      if (pcieGenerations.length > 0) {
        const minPcie = Math.min(...pcieGenerations);
        const maxPcie = Math.max(...pcieGenerations);
        filterConfig.push({
          id: "pcie.generation", // Note: The client-side page.tsx expects 'pcie.generation' for slider
          name: "PCIe Generation",
          type: "slider",
          min: minPcie,
          max: maxPcie,
          step: 1, // Assuming step of 1 for generations
        });
      }

      if (formFactorOptions.size > 0) {
        filterConfig.push({
          id: "form_factor",
          name: "Form Factor",
          type: "checkbox",
          options: Array.from(formFactorOptions).sort(),
        });
      }
    }

    return filterConfig;
  },
});
