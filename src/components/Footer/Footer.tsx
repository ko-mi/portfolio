import { Github, Linkedin, Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer} id="contact">
      <p className={styles.contactLine}>
        If this sounds like the kind of work you need, you can reach me here:
      </p>
      <nav className={styles.links}>
        <a href="mailto:michalina0.kowalczyk@gmail.com" className={styles.link}>
          Email
        </a>
        <a
          href="https://www.linkedin.com/in/michalina-ko/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          LinkedIn
        </a>
      </nav>
      <p className={styles.location}>
        Based in Europe · Working remotely
      </p>
      <div className={styles.footerBottom}>
        <div className={styles.brandContainer}>
          <span className={styles.brand}>MICHALINA</span>
          <span className={styles.brand}>KOWALCZYK</span>
        </div>
        <div className={styles.iconContainer}>
          <a
            href="https://github.com/ko-mi"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label="GitHub"
          >
            <Github className={styles.icon} />
          </a>
          <a
            href="https://www.linkedin.com/in/michalina-ko/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconLink}
            aria-label="LinkedIn"
          >
            <Linkedin className={styles.icon} />
          </a>
          <a
            href="mailto:michalina0.kowalczyk@gmail.com"
            className={styles.iconLink}
            aria-label="Email"
          >
            <Mail className={styles.icon} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

