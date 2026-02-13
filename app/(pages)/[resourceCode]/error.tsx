"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("VR Page Error:", error);
  }, [error]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 max-w-lg text-center">
        <h2 className="text-2xl font-bold text-red-100 mb-2">
          Something went wrong!
        </h2>
        <p className="text-red-200 mb-4">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
