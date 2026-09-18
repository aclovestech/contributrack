export function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <main className="@container/main flex flex-1 flex-col gap-2">
        {children}
      </main>
    </div>
  );
}
