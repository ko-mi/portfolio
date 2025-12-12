import { useEffect, useRef } from 'react';
import { smoothScrollTo } from '../../utils/smoothScroll';
import styles from './Header.module.css';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  const menuRef = useRef<HTMLElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Prevent focus from entering hidden menu
  useEffect(() => {
    if (!isOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach((el) => {
        (el as HTMLElement).setAttribute('tabindex', '-1');
      });
    } else if (isOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll('[tabindex="-1"]');
      focusableElements.forEach((el) => {
        (el as HTMLElement).removeAttribute('tabindex');
      });
    }
  }, [isOpen]);

  const handleLinkClick = (href: string, external: boolean = false) => {
    if (!external && href.startsWith('#')) {
      smoothScrollTo(href.substring(1));
    }
    onClose();
  };

  const menuItems = [
    { label: 'Work', href: '#problems', external: false },
    { label: 'How I help', href: '#value', external: false },
    { label: 'Writing', href: '#writing', external: false },
    { label: 'Contact', href: '#contact', external: false },
    { label: 'Resume', href: '#', external: true }, // Placeholder
    { label: 'GitHub', href: '#', external: true }, // Optional placeholder
    { label: 'LinkedIn', href: '#', external: true }, // Optional placeholder
  ];

  return (
    <>
      {isOpen && <div className={styles.overlay} aria-hidden="true" />}
      <nav
        ref={menuRef}
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ''}`}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        hidden={!isOpen}
      >
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href, item.external);
                }}
                className={styles.menuLink}
                {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default HamburgerMenu;


