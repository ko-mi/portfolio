import { useEffect, useRef } from 'react';
import { smoothScrollTo } from '../../utils/smoothScroll';
import styles from './Header.module.css';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleLinkClick = (href: string, external: boolean = false) => {
    if (!external && href.startsWith('#')) {
      smoothScrollTo(href.substring(1));
    }
    onClose();
  };

  const menuItems = [
    { label: 'Work', href: '#problems', external: false },
    { label: 'About', href: '#value', external: false },
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


