import { notFound } from "next/navigation";
import type { Metadata } from "next";
import FiveCanvasWrapper from "@/components/FiveCanvasWrapper";

interface PageProps {
  params: Promise<{ resourceCode: string }>;
}

/**
 * Generate Metadata for SEO and Browser Title
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { resourceCode } = await params;

  return {
    title: `VR Demo - ${resourceCode}`,
    description: `View Realsee VR content for resource ${resourceCode}`,
  };
}

/**
 * Server Component Page
 *
 * Acts as a lightweight container. Validate params here if needed.
 */
export default async function Page({ params }: PageProps) {
  const { resourceCode } = await params;

  if (!resourceCode) {
    notFound();
  }

  return <FiveCanvasWrapper resourceCode={resourceCode} />;
}
