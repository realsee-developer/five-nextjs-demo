"use client";

import { useEffect, useRef, useState } from "react";
import { Five, Work } from "@realsee/five";
import useSWR from "swr";
import { useFiveStore } from "@/hooks/useFiveStore";

/**
 * Props for the FiveCanvas component.
 */
interface FiveCanvasProps {
  /**
   * The unique resource code for the VR content to display.
   */
  resourceCode: string;
}

/**
 * Fetcher function for SWR
 */
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch VR data from server.");
  }
  const json = await res.json();
  if (json.code !== 0) {
    throw new Error(json.message || "Gateway returned an error.");
  }
  return json.data;
};

/**
 * FiveCanvas Component
 *
 * A Client Component that handles the initialization and rendering of the Five VR engine.
 * Uses SWR for data fetching and Zustand for state management.
 *
 * @param {FiveCanvasProps} props - Component props.
 * @returns {JSX.Element} The VR canvas container.
 */
export default function FiveCanvas({ resourceCode }: FiveCanvasProps) {
  // Reference to the DOM element where Five will render the canvas
  const containerRef = useRef<HTMLDivElement>(null);

  // Zustand store setter
  const setFiveInStore = useFiveStore((state) => state.setFive);

  // Local state for the Five instance (to trigger effects)
  const [fiveInstance, setFiveInstance] = useState<Five | null>(null);

  // SWR for data fetching
  const {
    data: workData,
    error,
    isLoading,
  } = useSWR(
    resourceCode ? `/api/vr/info?resourceCode=${resourceCode}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate on window focus for VR data
      shouldRetryOnError: false, // Let the Error Boundary handle it if it fails
    },
  );

  // Effect: Initialize Five instance on mount
  useEffect(() => {
    // Create a new Five instance
    const five = new Five();
    setFiveInstance(five);
    setFiveInStore(five);

    // Append the Five canvas to the container element
    if (containerRef.current) {
      five.appendTo(containerRef.current);
    }

    // Handler for window resize events to keep the canvas responsive
    const handleResize = () => {
      if (containerRef.current) {
        five.refresh({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup: Dispose of the Five instance and remove event listeners
    return () => {
      five.dispose();
      setFiveInStore(null as any); // Reset store (cast to any to avoid type issues if store expects Five)
      window.removeEventListener("resize", handleResize);
    };
  }, [setFiveInStore]);

  // Effect: Load the scene when data and five instance are ready
  useEffect(() => {
    if (fiveInstance && workData) {
      fiveInstance.load(workData).catch((err) => {
        console.error("Failed to load work data into Five:", err);
      });
    }
  }, [fiveInstance, workData]);

  // If there is a critical error, we can throw it to be caught by the nearest Error Boundary (error.tsx)
  if (error) {
    throw new Error(error.message || "Failed to load VR data");
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-black text-white relative"
      ref={containerRef}
    >
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 bg-black/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-lg font-medium">Loading VR Scene...</p>
        </div>
      )}
    </div>
  );
}
