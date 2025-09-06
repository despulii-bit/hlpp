import { query } from "./_generated/server";
import { v } from "convex/values";

export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.query) {
      return await ctx.db.query("listings").collect();
    }
    // This is a simple text search. For more advanced search,
    // you would need to use a search index.
    // See https://docs.convex.dev/text-search
    return await ctx.db
      .query("listings")
      .withIndex("by_title", (q) => q.eq("title", args.query))
      .collect();
  },
});
