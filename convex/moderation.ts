import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getModerationQueue = query({
  handler: async (ctx) => {
    return await ctx.db.query("moderation_queue").collect();
  },
});

export const approveSubmission = mutation({
  args: {
    submissionId: v.id("moderation_queue"),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    if (submission.type === "hardware_spec") {
      await ctx.db.insert("hardware_specs", {
        ...submission.content,
        submittedBy: submission.submitted_by,
        upvotes: 0,
        downvotes: 0,
      });
    } else if (submission.type === "listing") {
      await ctx.db.insert("listings", {
        ...submission.content,
        submittedBy: submission.submitted_by,
      });
    }

    await ctx.db.delete(args.submissionId);
  },
});

export const rejectSubmission = mutation({
  args: {
    submissionId: v.id("moderation_queue"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.submissionId);
  },
});
