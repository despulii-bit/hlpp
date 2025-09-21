import { query } from "./_generated/server";
import { v } from "convex/values";

export const search = query({
  args: {
    categoryName: v.string(),
    filters: v.optional(v.any()),
    // Make the text query optional so you can filter without it
    query: v.optional(v.string()),
    sortBy: v.optional(v.union(v.string(), v.null())), // Added sortBy, allowing null for no sorting
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))), // Added sortOrder
  },
  handler: async (ctx, args) => {
    if (!args.categoryName) {
      return [];
    }

    let listings = await ctx.db
      .query("listings")
      .withIndex("by_category", (q) =>
        q.eq("category", args.categoryName.toUpperCase()),
      )
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

    if (args.sortBy && listings.length > 0) {
      listings.sort((a, b) => {
        let valA: any;
        let valB: any;

        // Special handling for title (string comparison)
        if (args.sortBy === "title") {
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
        } else if (typeof args.sortBy === "string") {
          const sortByKey = args.sortBy;
          const keys = sortByKey.split(".");
          const primaryKey = keys[0];
          const nestedKey = keys.length > 1 ? keys[1] : undefined;

          valA = nestedKey
            ? (a.specs?.[primaryKey]?.[nestedKey] ?? null)
            : (a.specs?.[primaryKey] ?? null);
          valB = nestedKey
            ? (b.specs?.[primaryKey]?.[nestedKey] ?? null)
            : (b.specs?.[primaryKey] ?? null);
        } else {
          valA = null;
          valB = null;

          // If values are null/undefined, push them to the end
          if (valA === null && valB !== null)
            return args.sortOrder === "asc" ? 1 : -1;
          if (valB === null && valA !== null)
            return args.sortOrder === "asc" ? -1 : 1;
          if (valA === null && valB === null) return 0;
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return args.sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else if (typeof valA === "number" && typeof valB === "number") {
          return args.sortOrder === "asc" ? valA - valB : valB - valA;
        }
        return 0; // Fallback for incomparable types or nulls
      });
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
      .withIndex("by_category", (q) =>
        q.eq("category", args.categorySlug.toUpperCase()),
      )
      .collect();

    const specsOptions: Record<string, Set<string>> = {};
    const numericSpecs: Record<string, number[]> = {
      "power_consumption.nominal_watts": [],
      "device_support.max_devices": [],
    };

    // Defines the filters for the HBA category
    const specDefinitions: Record<string, { name: string; type: string }> = {
      controller_mode: { name: "controller mode", type: "radio" },
      form_factor: { name: "form factor", type: "checkbox" },
      cable_support: { name: "cable support", type: "checkbox" },
      data_rate: { name: "data rate", type: "checkbox" },
      operating_mode: { name: "operating mode", type: "checkbox" },
      "pcie.lanes": { name: "pcie lanes", type: "checkbox" },
      raid_support: { name: "raid support", type: "checkbox" },
      "pcie.generation": { name: "pcie generation", type: "checkbox" }, // Changed to checkbox

      // New filters as per request
      "power_consumption.nominal_watts": {
        name: "power consumption (W)",
        type: "slider",
      },
      operating_system_support: {
        name: "operating system support",
        type: "checkbox",
      },
      "device_support.max_devices": {
        name: "max devices supported",
        type: "slider",
      },
      "device_support.types": { name: "device types", type: "checkbox" },
      "connectors.count": { name: "connector count", type: "checkbox" },
      "connectors.lanes": { name: "connector lanes", type: "checkbox" },
      "connectors.location": { name: "connector location", type: "checkbox" },
      "connectors.type": { name: "connector type", type: "checkbox" },
    };

    for (const listing of listings) {
      const specs = listing.specs as Record<string, any>;

      for (const key in specDefinitions) {
        // Skip connector keys for the general handling
        if (key.startsWith("connectors.")) {
          continue;
        }

        // Handle nested keys like "pcie.generation" or "power_consumption.nominal_watts"
        const keys = key.split(".");
        let value = specs;
        for (const k of keys) {
          value = value?.[k];
        }

        if (value === undefined || value === null) continue;

        if (specDefinitions[key].type === "slider") {
          if (typeof value === "number") {
            numericSpecs[key].push(value);
          }
        } else {
          // Checkbox/Radio types
          if (!specsOptions[key]) {
            specsOptions[key] = new Set();
          }
          if (Array.isArray(value)) {
            value.forEach((v) =>
              specsOptions[key].add(String(v).toLowerCase()),
            );
          } else {
            specsOptions[key].add(String(value).toLowerCase());
          }
        }
      }

      // Special handling for connectors array of objects
      if (specs.connectors && Array.isArray(specs.connectors)) {
        for (const connector of specs.connectors) {
          if (connector.count !== undefined) {
            if (!specsOptions["connectors.count"])
              specsOptions["connectors.count"] = new Set();
            specsOptions["connectors.count"].add(
              String(connector.count).toLowerCase(),
            );
          }
          if (connector.lanes !== undefined) {
            if (!specsOptions["connectors.lanes"])
              specsOptions["connectors.lanes"] = new Set();
            specsOptions["connectors.lanes"].add(
              String(connector.lanes).toLowerCase(),
            );
          }
          if (connector.location !== undefined) {
            if (!specsOptions["connectors.location"])
              specsOptions["connectors.location"] = new Set();
            specsOptions["connectors.location"].add(
              String(connector.location).toLowerCase(),
            );
          }
          if (connector.type !== undefined) {
            if (!specsOptions["connectors.type"])
              specsOptions["connectors.type"] = new Set();
            specsOptions["connectors.type"].add(
              String(connector.type).toLowerCase(),
            );
          }
        }
      }
    }

    const filterConfig: any[] = [];

    const normalizedCategorySlug = args.categorySlug.toLowerCase();
    if (normalizedCategorySlug === "hba") {
      for (const key in specDefinitions) {
        const def = specDefinitions[key];

        if (def.type === "slider") {
          const values = numericSpecs[key];
          if (values && values.length > 0) {
            const min = Math.min(...values);
            const max = Math.max(...values);
            filterConfig.push({
              id: key,
              name: def.name,
              type: "slider",
              min,
              max,
              step: 1, // Assuming step of 1 for generations
            });
          }
        } else {
          const options = specsOptions[key];
          if (options && options.size > 0) {
            filterConfig.push({
              id: key,
              name: def.name,
              type: def.type,
              options: Array.from(options).sort(),
            });
          }
        }
      }
    }

    return filterConfig;
  },
});

export const getListingSpecs = query({
  handler: async (ctx) => {
    const listings = await ctx.db.query("listings").collect();
    return listings.map((listing) => ({
      _id: listing._id,
      _creationTime: listing._creationTime,
      title: listing.title,
      specs: listing.specs,
    }));
  },
});
