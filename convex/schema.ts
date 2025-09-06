import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Hardware_specs table has been removed.
export default defineSchema({
  listings: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    submittedBy: v.id("users"),
  }).index("by_title", ["title"]),
  users: defineTable({
    name: v.string(),
    reputation: v.number(),
  }),
  affiliate_links: defineTable({
    store_name: v.string(),
    link_template: v.string(),
  }),
});
