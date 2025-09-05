import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitHardware = mutation({
  args: {
    manufacturer: v.string(),
    model: v.string(),
    powerDraw: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if a user record exists, if not, create one.
    // This is a simplified user creation logic.
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), identity.name!))
      .first();

    let userId;

    if (user === null) {
      userId = await ctx.db.insert("users", {
        name: identity.name!,
        reputation: 0,
      });
    } else {
      userId = user._id;
    }

    const submissionId = await ctx.db.insert("hardware_specs", {
      manufacturer: args.manufacturer,
      model: args.model,
      powerDraw: args.powerDraw,
      submittedBy: userId,
      upvotes: 0,
      downvotes: 0,
    });

    return submissionId;
  },
});
