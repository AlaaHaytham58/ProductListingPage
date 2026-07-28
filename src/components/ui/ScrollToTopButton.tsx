import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={cn(
        'fixed bottom-6 end-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition-all duration-300 hover:bg-primary-700',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <ArrowUp size={20} />
    </button>
  );
}
