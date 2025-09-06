import { mutation } from "./_generated/server";
import hbaData from "../data/hba.json";

export const seedHbaData = mutation({
  handler: async (ctx) => {
    // Check if there's at least one user to associate the listings with
    let user = await ctx.db.query("users").first();
    if (!user) {
      // If no user exists, create a dummy user
      const userId = await ctx.db.insert("users", {
        name: "Admin",
        reputation: 100,
      });
      user = await ctx.db.get(userId);
    }

    if (!user) {
      throw new Error(
        "Could not create or find a user to associate listings with.",
      );
    }

    // Seed the database with HBA data
    for (const hba of hbaData) {
      await ctx.db.insert("listings", {
        title: hba.product_name,
        description: hba.description,
        price: 0, // Placeholder price
        submittedBy: user._id,
      });
    }

    return {
      message: `Successfully seeded ${hbaData.length} HBA listings.`,
    };
  },
});
