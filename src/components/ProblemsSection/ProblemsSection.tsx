import { useState } from 'react';
import { ProblemCard } from '../../types';
import ProblemCardComponent from './ProblemCard';
import Modal from './Modal';
import styles from './ProblemsSection.module.css';
import { defaultProblems } from '../../content/defaultProblems';

interface ProblemsSectionProps {
  problems?: ProblemCard[];
}

const ProblemsSection = ({ problems = defaultProblems }: ProblemsSectionProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCard, setSelectedCard] = useState<ProblemCard | null>(null);

  const handleCardClick = (card: ProblemCard) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  // Short tab names - problem/outcome focused
  const tabNames = [
    'Migration',
    'CMS & content systems',
    'Lead flow',
    'Analytics & tracking',
    'Team workflows',
  ];

  return (
    <section className={styles.problemsSection} id="problems">
      <h2 className={styles.heading}>Selected work</h2>
      <div className={styles.tabbedLayout}>
        <div className={styles.tabs}>
          {problems.map((card, index) => (
            <button
              key={card.id}
              className={`${styles.tab} ${index === activeTab ? styles.active : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {card.tabLabel || tabNames[index] || card.title}
            </button>
          ))}
        </div>
        <div className={styles.tabContent}>
          <ProblemCardComponent
            problem={problems[activeTab]}
            onClick={() => handleCardClick(problems[activeTab])}
          />
        </div>
      </div>
      <Modal card={selectedCard} onClose={handleCloseModal} />
    </section>
  );
};

export default ProblemsSection;

