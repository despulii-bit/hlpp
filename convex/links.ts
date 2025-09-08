// convex/links.ts
import { action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
// Import 'internal' specifically for internal queries from the generated API
import { internal } from "./_generated/api";

/**
 * Internal query to fetch the affiliate link pattern for a given store code.
 * This function is used by other Convex functions and is not directly exposed to clients.
 */
export const getAffiliateLinkPattern = internalQuery({
  args: {
    store_code: v.string(),
  },
  handler: async (ctx, args) => {
    // The 'q' parameter in the filter callback will now be correctly typed by Convex.
    return await ctx.db
      .query("affiliate_links")
      .filter((q) => q.eq(q.field("store_name"), args.store_code))
      .first();
  },
});

/**
 * Action to generate a final affiliate link based on a store code and product ID.
 * This action first looks up the affiliate link template using an internal query
 * and then constructs the final URL.
 */
export const generateAffiliateLink = action({
  args: {
    store_code: v.string(),
    product_id: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    // 1. Look up the affiliate link pattern using the dedicated internal query.
    // ctx.runQuery expects a FunctionReference, which internal.links.getAffiliateLinkPattern provides.
    // Explicitly type `affiliateLink` to resolve potential implicit `any` errors
    // and provide clear type information.
    // The internal query returns a document or null, so the type should reflect that.
    const affiliateLink: { link_template: string } | null = await ctx.runQuery(
      internal.links.getAffiliateLinkPattern, // Correctly calling the internal query
      { store_code: args.store_code },
    );

    if (!affiliateLink) {
      throw new Error(
        `Affiliate link pattern not found for store: ${args.store_code}`,
      );
    }

    // 2. Construct the final URL by replacing the placeholder in the link template.
    // We assume the 'affiliate_links' table documents have a 'link_template' field.
    const finalUrl = affiliateLink.link_template.replace(
      "{product_id}",
      args.product_id,
    );

    // 3. Return the generated URL.
    return finalUrl;
  },
});
