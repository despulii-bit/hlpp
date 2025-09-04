"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HardwareSubmissionForm() {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [powerDraw, setPowerDraw] = useState("");
  const submitHardware = useMutation(api.submissions.submitHardware);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manufacturer || !model || !powerDraw) return;

    try {
      await submitHardware({
        manufacturer,
        model,
        powerDraw: parseInt(powerDraw, 10),
      });
      setManufacturer("");
      setModel("");
      setPowerDraw("");
      alert("Submission successful!");
    } catch (error) {
      console.error("Failed to submit hardware:", error);
      alert("Submission failed. See console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
          Manufacturer
        </label>
        <input
          type="text"
          id="manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
          Model
        </label>
        <input
          type="text"
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="powerDraw" className="block text-sm font-medium text-gray-700">
          Power Draw (Watts)
        </label>
        <input
          type="number"
          id="powerDraw"
          value={powerDraw}
          onChange={(e) => setPowerDraw(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
}
