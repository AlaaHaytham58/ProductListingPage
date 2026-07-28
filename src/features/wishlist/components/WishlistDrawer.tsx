import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { WishlistItem } from './WishlistItem';
import { Button } from '../../../components/ui/Button';
import { useI18n } from '../../../i18n/i18nContext';
import { useEscapeKey } from '../../../hooks/useEscapeKey';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { t } = useI18n();
  const { items, clearWishlist } = useWishlist();

  useEscapeKey(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-neutral-900/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 end-0 z-50 flex w-full max-w-sm flex-col bg-surface p-5 shadow-lg dark:bg-surface-elevated"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-neutral-900 dark:text-neutral-50">
                {t.wishlist.title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <Heart size={40} className="text-neutral-300" />
                <p className="text-neutral-500">{t.wishlist.empty}</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {items.map((product) => (
                    <WishlistItem key={product.id} product={product} />
                  ))}
                </div>
                <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                  <Button variant="outline" className="w-full" onClick={clearWishlist}>
                    {t.wishlist.clear}
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
