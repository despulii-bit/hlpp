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
