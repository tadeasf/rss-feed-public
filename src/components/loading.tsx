export default function Loading() {
  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="h-10 w-20 bg-gray-200 animate-pulse rounded" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
} 