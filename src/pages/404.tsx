// For pages directory (pages/404.tsx)
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sorry!</h2>
        <p className="text-gray-600 mb-6">
          The link is broken, try to refresh or go to home
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go To Home
        </a>
      </div>
    </div>
  );
}