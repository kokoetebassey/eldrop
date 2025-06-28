"use client";
import dynamic from "next/dynamic";

// Dynamically import the main GetStarted content
const GetStartedContent = dynamic(() => import("./GetStartedContent"), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

export default function GetStarted() {
  return <GetStartedContent />;
}
