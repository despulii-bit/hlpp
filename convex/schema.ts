import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Hardware_specs table has been removed.
export default defineSchema({
  listings: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.optional(v.number()), // Made optional since it's not in hba.json
    submittedBy: v.optional(v.id("users")), // Made optional for initial data ingestion
    category: v.string(), // New category field
    specs: v.any(), // New specs field to store the HBA details
  })
    .index("by_title", ["title"])
    .index("by_category", ["category"]), // New index for category
  users: defineTable({
    name: v.string(),
    reputation: v.number(),
  }),
  affiliate_links: defineTable({
    store_name: v.string(),
    link_template: v.string(),
  }),
});
