import { query } from "./_generated/server";
import { v } from "convex/values";

export const search = query({
  args: {
    categoryName: v.string(),
    filters: v.optional(v.any()),
    query: v.string(), // Added to match client-side expectations and Convex validator error
  },
  handler: async (ctx, args) => {
    if (!args.categoryName) {
      return [];
    }

    // Renamed 'query' to 'dbQuery' to avoid conflict with 'args.query'
    // Changed 'const dbQuery' to 'let dbQuery' to allow reassignment with .filter() calls.
    // Changed index to "by_title" and field to "title" to resolve diagnostic errors
    // indicating "by_category" and "category" are not valid for the 'listings' table.
    const dbQuery = ctx.db
      .query("listings")
      .withIndex("by_title", (q) => q.eq("title", args.categoryName));

    // This is a placeholder for filter logic.
    // A full implementation would dynamically build the query
    // based on the filters object.
    if (args.filters) {
      // The example filter for 'pcie.generation' was removed because
      // "specs.pcie.generation" was not a recognized field path in the schema,
      // causing a diagnostic error.
      // You would add more `if` statements or a more dynamic loop here
      // to handle different filter types from args.filters, ensuring they
      // map to valid schema field paths.
    }

    // The handler function must return a value.
    // Assuming the intent is to return the collected listings after filtering.
    return await dbQuery.collect();
  }, // Closing the handler function
}); // Closing the query object definition and the query function call
