import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-100',
        className,
      )}
    >
      {children}
    </span>
  );
}
