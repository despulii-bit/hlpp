"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}

import HardwareSubmissionForm from "@/components/HardwareSubmissionForm";

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser);
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit New Hardware</h1>
      <HardwareSubmissionForm />
      <hr className="my-8" />
      <h2 className="text-xl font-bold mb-4">Authenticated Content</h2>
      <div>Messages: {messages?.length ?? "Loading..."}</div>
    </main>
  );
}
