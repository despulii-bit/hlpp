"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function ModerationPage() {
  const submissions = useQuery(api.moderation.getModerationQueue);
  const approveSubmission = useMutation(api.moderation.approveSubmission);
  const rejectSubmission = useMutation(api.moderation.rejectSubmission);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleApprove = async (submissionId: string) => {
    try {
      await approveSubmission({ submissionId });
      setFeedback({ message: "Submission approved", type: "success" });
    } catch (error) {
      setFeedback({
        message: "Error approving submission",
        type: "error",
      });
      console.error(error);
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      await rejectSubmission({ submissionId });
      setFeedback({ message: "Submission rejected", type: "success" });
    } catch (error) {
      setFeedback({
        message: "Error rejecting submission",
        type: "error",
      });
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Moderation Queue</h1>
      {feedback && (
        <div
          className={`p-4 mb-4 rounded-md ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}
      <ul className="space-y-4">
        {submissions?.map((submission) => (
          <li
            key={submission._id}
            className="p-4 border rounded-md shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {submission.content.title ||
                `${submission.content.manufacturer} ${submission.content.model}`}
            </h2>
            <p className="text-gray-600">Type: {submission.type}</p>
            <p className="text-gray-600">
              Submitted: {new Date(submission.timestamp).toLocaleString()}
            </p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleApprove(submission._id)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(submission._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
