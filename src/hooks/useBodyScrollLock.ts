import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll.
 * 
 * Prevents body scrolling when a modal or menu is open, ensuring
 * the underlying content doesn't scroll while the overlay is active.
 * Properly cleans up on unmount to restore scrolling.
 * 
 * @param lock - Whether to lock the body scroll (true) or allow scrolling (false)
 * 
 * @example
 * ```typescript
 * function Modal({ isOpen }: { isOpen: boolean }) {
 *   useBodyScrollLock(isOpen);
 *   
 *   if (!isOpen) return null;
 *   return <div>Modal content</div>;
 * }
 * ```
 * 
 * @example
 * ```typescript
 * function Menu() {
 *   const [isMenuOpen, setIsMenuOpen] = useState(false);
 *   useBodyScrollLock(isMenuOpen);
 *   
 *   return <nav>...</nav>;
 * }
 * ```
 */
export function useBodyScrollLock(lock: boolean): void {
  useEffect(() => {
    if (lock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup: always restore scrolling on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [lock]);
}
