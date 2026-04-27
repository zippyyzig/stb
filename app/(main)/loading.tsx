import Header from "@/components/layout/Header";

export default function MainLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Page title skeleton */}
          <div className="mb-6">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded-lg bg-muted" />
          </div>

          {/* Content grid skeleton */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="aspect-square animate-pulse rounded-lg bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
