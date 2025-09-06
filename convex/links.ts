// convex/links.ts
import { action } from "./_generated/server";
import { v } from "convex/values";

export const generateAffiliateLink = action({
  args: {
    store_code: v.string(),
    product_id: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Look up the affiliate link pattern
    const affiliateLink = await ctx.runQuery(async (q) => {
      return await q.db
        .query("affiliate_links")
        .filter((q) => q.eq(q.field("store_name"), args.store_code))
        .first();
    });

    if (!affiliateLink) {
      throw new Error(`Affiliate link pattern not found for store: ${args.store_code}`);
    }

    // 2. Construct the final URL
    const finalUrl = affiliateLink.link_template.replace(
      "{product_id}",
      args.product_id
    );

    // 3. Return the generated URL
    return finalUrl;
  },
});
