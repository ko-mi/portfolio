import styles from './ValueSectionDemo.module.css';

const ValueSectionDemo = () => {
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
    <div className={styles.demoContainer}>
      {/* Option 1: Simple List with Dividers */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 1: Simple List with Dividers</h3>
        <div className={styles.valueSection}>
          <h2 className={styles.heading}>Value I can add</h2>
          <p className={styles.intro}>
            Built for teams who know the goal, but need the system.
          </p>
          <ul className={styles.simpleList}>
            {valuePoints.map((point) => (
              <li key={point.id} className={styles.listItem}>
                <span className={styles.bullet}>•</span>
                <span className={styles.listText}>{point.text}</span>
              </li>
            ))}
          </ul>
          <p className={styles.closing}>
            A system that continues to work after handover.
          </p>
        </div>
      </section>

      {/* Option 2: Numbered List */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 2: Numbered List</h3>
        <div className={styles.valueSection}>
          <h2 className={styles.heading}>Value I can add</h2>
          <p className={styles.intro}>
            Built for teams who know the goal, but need the system.
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
        </div>
      </section>

      {/* Option 3: Single Column with Spacing */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 3: Single Column with Spacing</h3>
        <div className={styles.valueSection}>
          <h2 className={styles.heading}>Value I can add</h2>
          <p className={styles.intro}>
            Built for teams who know the goal, but need the system.
          </p>
          <div className={styles.singleColumn}>
            {valuePoints.map((point) => (
              <p key={point.id} className={styles.paragraphItem}>
                {point.text}
              </p>
            ))}
          </div>
          <p className={styles.closing}>
            A system that continues to work after handover.
          </p>
        </div>
      </section>

      {/* Option 4: Minimal with Subtle Background */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 4: Minimal with Subtle Background</h3>
        <div className={styles.valueSection}>
          <h2 className={styles.heading}>Value I can add</h2>
          <p className={styles.intro}>
            Built for teams who know the goal, but need the system.
          </p>
          <div className={styles.minimalContainer}>
            {valuePoints.map((point) => (
              <div key={point.id} className={styles.minimalItem}>
                <p className={styles.minimalText}>{point.text}</p>
              </div>
            ))}
          </div>
          <p className={styles.closing}>
            A system that continues to work after handover.
          </p>
        </div>
      </section>

      {/* Option 5: Two Column Text (No Cards) */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 5: Two Column Text (No Cards)</h3>
        <div className={styles.valueSection}>
          <h2 className={styles.heading}>Value I can add</h2>
          <p className={styles.intro}>
            Built for teams who know the goal, but need the system.
          </p>
          <div className={styles.twoColumnText}>
            {valuePoints.map((point) => (
              <p key={point.id} className={styles.columnText}>
                {point.text}
              </p>
            ))}
          </div>
          <p className={styles.closing}>
            A system that continues to work after handover.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ValueSectionDemo;

