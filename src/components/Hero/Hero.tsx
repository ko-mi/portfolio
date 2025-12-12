import { smoothScrollTo } from '../../utils/smoothScroll';
import styles from './Hero.module.css';

const Hero = () => {
  const handleCTAClick = () => {
    smoothScrollTo('problems');
  };

  return (
    <section className={styles.hero} id="hero">
      <h1 className={styles.heading}>
        Websites built as systems, not pages.
      </h1>
      <p className={styles.subline}>
        Growth-focused web infrastructure for SaaS teams.
      </p>
      <button
        className={styles.cta}
        onClick={handleCTAClick}
        aria-label="View selected work"
      >
        View selected work
      </button>
    </section>
  );
};

export default Hero;


