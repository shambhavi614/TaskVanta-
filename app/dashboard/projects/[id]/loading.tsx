export default function ProjectLoading() {
  return (
    <div className="space-y-6">
      <div className="card glass-effect p-6 animate-pulse">
        <div className="h-8 bg-gray-700/50 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-96"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card glass-effect p-4 animate-pulse">
            <div className="h-6 bg-gray-700/50 rounded w-24 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-24 bg-gray-800/50 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
