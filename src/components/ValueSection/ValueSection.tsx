import styles from './ValueSection.module.css';

const ValueSection = () => {
  const valuePoints = [
    {
      id: '1',
      text: 'Turn requirements into working web systems',
    },
    {
      id: '2',
      text: 'Translate business goals into architecture and implementation',
    },
    {
      id: '3',
      text: 'Connect CMS, forms, analytics, and integrations into one coherent setup',
    },
    {
      id: '4',
      text: 'Tool-agnostic by default. Focused on fit, constraints, and maintainability.',
    },
  ];

  return (
    <section className={styles.valueSection} id="value">
      <h2 className={styles.heading}>How I help</h2>
      <p className={styles.intro}>
        Building for teams who know the goal, but need the system.
      </p>
      <ol className={styles.numberedList}>
        {valuePoints.map((point, index) => (
          <li key={point.id} className={styles.numberedItem}>
            <span className={styles.number}>{index + 1}</span>
            <span className={styles.listText}>{point.text}</span>
          </li>
        ))}
      </ol>
      <p className={styles.closing}>
        A system that continues to work after handover.
      </p>
    </section>
  );
};

export default ValueSection;

