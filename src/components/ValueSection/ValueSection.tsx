import styles from './ValueSection.module.css';

const ValueSection = () => {
  const valuePoints = [
    {
      id: '1',
      text: 'Helping non-technical or semi-technical teams turn requirements into working systems',
    },
    {
      id: '2',
      text: 'Translating business goals into concrete architecture, not tool demos',
    },
    {
      id: '3',
      text: 'Connecting CMS, forms, analytics, and integrations into one coherent setup',
    },
    {
      id: '4',
      text: 'Tool-agnostic by default — focused on fit, constraints, and maintainability',
    },
  ];

  return (
    <section className={styles.valueSection} id="value">
      <h2 className={styles.heading}>What I do best</h2>
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

