"use client";

import dynamic from "next/dynamic";

const FiveCanvas = dynamic(() => import("./FiveCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
      <p className="text-lg font-medium">Loading VR Engine...</p>
    </div>
  ),
});

interface FiveCanvasWrapperProps {
  resourceCode: string;
}

export default function FiveCanvasWrapper({
  resourceCode,
}: FiveCanvasWrapperProps) {
  return <FiveCanvas resourceCode={resourceCode} />;
}
