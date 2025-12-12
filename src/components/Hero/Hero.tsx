import { smoothScrollTo } from '../../utils/smoothScroll';
import styles from './Hero.module.css';

const Hero = () => {
  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo('problems');
  };

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Websites built as systems, not pages.
        </h1>
        <p className={styles.subline}>
          Growth-focused web infrastructure for SaaS teams.
        </p>
        <a
          href="#problems"
          className={styles.cta}
          onClick={handleCTAClick}
          aria-label="View selected work"
        >
          View selected work
        </a>
      </div>
    </section>
  );
};

export default Hero;


