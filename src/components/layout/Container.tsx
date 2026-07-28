import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-[90%] max-w-[1800px]', className)}>{children}</div>;
}
