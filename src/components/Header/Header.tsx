import { useState, useEffect } from 'react';
import HamburgerMenu from './HamburgerMenu';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.brandContainer}>
          <span className={styles.brand}>MICHALINA</span>
          <span className={styles.brand}>KOWALCZYK</span>
        </div>
        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburgerIcon} aria-hidden="true">
            <span className={isMenuOpen ? styles.open : ''}></span>
            <span className={isMenuOpen ? styles.open : ''}></span>
            <span className={isMenuOpen ? styles.open : ''}></span>
          </span>
        </button>
        <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
};

export default Header;

