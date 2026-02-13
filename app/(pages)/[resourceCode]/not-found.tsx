import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4">Resource Not Found</h2>
      <p className="text-gray-400 mb-6">
        Could not find the requested VR resource.
      </p>
      <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
        Return Home
      </Link>
    </div>
  );
}
