import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer} id="contact">
      <p className={styles.contactLine}>
        If this sounds like the kind of work you need, you can reach me here:
      </p>
      <nav className={styles.links}>
        <a href="mailto:your.email@example.com" className={styles.link}>
          Email
        </a>
        <a
          href="#"
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
    </footer>
  );
};

export default Footer;

