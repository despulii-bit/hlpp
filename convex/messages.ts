// File: hlpp/convex/messages.ts

import { query } from "./_generated/server";

export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), identity.name!))
      .first();

    if (user === null) {
      return [];
    }

    // Returning empty array since hardware_specs have been removed
    return [];
  },
});
