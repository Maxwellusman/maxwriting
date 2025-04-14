import { NextSeo } from "next-seo";

export default function NotFound() {
  return (
    <>
      <NextSeo
        title="404 - Page Not Found | MaxWritings"
        description="The page you're looking for might have been removed, had its name changed, or is temporarily unavailable."
        noindex
      />
      <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The page you're looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
          <a
            href="/"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go To Homepage
          </a>
        </div>
      </div>
    </>
  );
}
