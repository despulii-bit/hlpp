import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  hardware_specs: defineTable({
    manufacturer: v.string(),
    model: v.string(),
    powerDraw: v.number(),
    submittedBy: v.id("users"),
    upvotes: v.number(),
    downvotes: v.number(),
  }),
  listings: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    submittedBy: v.id("users"),
  }),
  users: defineTable({
    name: v.string(),
    reputation: v.number(),
  }),
  moderation_queue: defineTable({
    type: v.union(v.literal("hardware_spec"), v.literal("listing")),
    submitted_by: v.id("users"),
    content: v.any(),
    timestamp: v.string(),
  }),
});
