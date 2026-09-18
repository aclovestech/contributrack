import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 py-5 md:gap-8 md:py-6">
      <div className="space-y-2 border-b px-4 pb-5 lg:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-36 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mx-4 h-72 lg:mx-6" />
    </div>
  );
}
