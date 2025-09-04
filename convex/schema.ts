import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  hardwareSubmissions: defineTable({
    manufacturer: v.string(),
    model: v.string(),
    powerDraw: v.number(),
    status: v.union(v.literal("pending"), v.literal("approved")),
    submittedBy: v.id("users"),
    upvotes: v.number(),
    downvotes: v.number(),
  }),
  users: defineTable({
    name: v.string(),
    reputation: v.number(),
  }),
});
