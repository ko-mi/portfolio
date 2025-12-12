import { useState, useRef, useEffect } from 'react';
import { ProblemCard } from '../../types';
import ProblemCardComponent from './ProblemCard';
import styles from './Carousel.module.css';

interface CarouselProps {
  cards: ProblemCard[];
  onCardClick: (card: ProblemCard) => void;
}

const Carousel = ({ cards, onCardClick }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Show one card at a time, with peek of adjacent

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (carouselRef.current) {
      const cardElement = carouselRef.current.querySelector(`[data-card-index="${currentIndex}"]`) as HTMLElement;
      if (cardElement) {
        const containerWidth = carouselRef.current.offsetWidth;
        const cardLeft = cardElement.offsetLeft;
        const cardWidth = cardElement.offsetWidth;
        const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;
        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < cards.length - 1;

  return (
    <div className={styles.carouselContainer}>
      {canGoPrev && (
        <button
          className={styles.navButton}
          onClick={handlePrev}
          aria-label="Previous cards"
        >
          ←
        </button>
      )}
      <div
        ref={carouselRef}
        className={styles.carousel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className={styles.carouselTrack}>
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              className={styles.carouselCard}
              data-card-index={index}
            >
              <ProblemCardComponent
                problem={card}
                onClick={() => onCardClick(card)}
              />
            </div>
          ))}
        </div>
      </div>
      {canGoNext && (
        <button
          className={styles.navButton}
          onClick={handleNext}
          aria-label="Next cards"
        >
          →
        </button>
      )}
      <div className={styles.dots}>
        {cards.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

