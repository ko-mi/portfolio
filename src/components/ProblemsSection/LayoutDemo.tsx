import { useState } from 'react';
import { ProblemCard } from '../../types';
import ProblemCardComponent from './ProblemCard';
import Modal from './Modal';
import styles from './LayoutDemo.module.css';

interface LayoutDemoProps {
  cards: ProblemCard[];
  onCardClick: (card: ProblemCard) => void;
}

const LayoutDemo = ({ cards, onCardClick }: LayoutDemoProps) => {
  const [selectedCard, setSelectedCard] = useState<ProblemCard | null>(null);

  const handleCardClick = (card: ProblemCard) => {
    setSelectedCard(card);
    onCardClick(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  // Show only first 3 cards for demo
  const demoCards = cards.slice(0, 3);

  return (
    <div className={styles.layoutDemo}>
      {/* Option 1: Responsive Grid */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 1: Responsive Grid (Staggered)</h3>
        <div className={styles.gridLayout}>
          {demoCards.map((card) => (
            <div key={card.id} className={styles.gridCard}>
              <ProblemCardComponent
                problem={card}
                onClick={() => handleCardClick(card)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Option 2: Vertical Accordion */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 2: Vertical Accordion Stack</h3>
        <div className={styles.accordionLayout}>
          {demoCards.map((card, index) => (
            <AccordionCard
              key={card.id}
              card={card}
              isExpanded={index === 0}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </section>

      {/* Option 3: Tabbed Interface */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 3: Tabbed Interface</h3>
        <TabbedLayout cards={demoCards} onCardClick={handleCardClick} />
      </section>

      {/* Option 4: Masonry */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 4: Masonry Layout</h3>
        <div className={styles.masonryLayout}>
          {demoCards.map((card) => (
            <div key={card.id} className={styles.masonryCard}>
              <ProblemCardComponent
                problem={card}
                onClick={() => handleCardClick(card)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Option 5: Full-width Stacked */}
      <section className={styles.optionSection}>
        <h3 className={styles.optionTitle}>Option 5: Full-width Stacked</h3>
        <div className={styles.stackedLayout}>
          {demoCards.map((card) => (
            <ProblemCardComponent
              key={card.id}
              problem={card}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </section>

      <Modal card={selectedCard} onClose={handleCloseModal} />
    </div>
  );
};

// Accordion Card Component
const AccordionCard = ({
  card,
  isExpanded,
  onClick,
}: {
  card: ProblemCard;
  isExpanded: boolean;
  onClick: () => void;
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  return (
    <div className={`${styles.accordionCard} ${expanded ? styles.expanded : ''}`}>
      <button
        className={styles.accordionHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <h4 className={styles.accordionTitle}>{card.title}</h4>
        <span className={styles.accordionIcon}>{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className={styles.accordionContent}>
          <ProblemCardComponent problem={card} onClick={onClick} />
        </div>
      )}
    </div>
  );
};

// Tabbed Layout Component
const TabbedLayout = ({
  cards,
  onCardClick,
}: {
  cards: ProblemCard[];
  onCardClick: (card: ProblemCard) => void;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.tabbedLayout}>
      <div className={styles.tabs}>
        {cards.map((card, index) => (
          <button
            key={card.id}
            className={`${styles.tab} ${index === activeTab ? styles.active : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {card.title.substring(0, 30)}...
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        <ProblemCardComponent
          problem={cards[activeTab]}
          onClick={() => onCardClick(cards[activeTab])}
        />
      </div>
    </div>
  );
};

export default LayoutDemo;

