import { Skeleton } from '../../../components/ui/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="mt-2 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );
}
