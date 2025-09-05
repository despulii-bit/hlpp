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

    return await ctx.db
      .query("hardware_specs")
      .filter((q) => q.eq(q.field("submittedBy"), user._id))
      .collect();
  },
});
