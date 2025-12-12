import { ProblemCard as ProblemCardType } from '../../types';
import styles from './ProblemsSection.module.css';

interface ProblemCardProps {
  problem: ProblemCardType;
  onClick?: () => void;
}

// Simple SVG illustrations
const illustrations = {
  '1': (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="160" height="120" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <rect x="30" y="50" width="60" height="40" rx="4" fill="currentColor" opacity="0.1"/>
      <rect x="100" y="50" width="70" height="20" rx="4" fill="currentColor" opacity="0.1"/>
      <rect x="100" y="80" width="70" height="20" rx="4" fill="currentColor" opacity="0.1"/>
      <circle cx="50" cy="130" r="15" fill="currentColor" opacity="0.15"/>
      <circle cx="100" cy="130" r="15" fill="currentColor" opacity="0.15"/>
      <circle cx="150" cy="130" r="15" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  '2': (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 50 L170 50 L170 150 L30 150 Z" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="none"/>
      <rect x="40" y="70" width="120" height="8" rx="4" fill="currentColor" opacity="0.2"/>
      <rect x="40" y="90" width="100" height="8" rx="4" fill="currentColor" opacity="0.2"/>
      <rect x="40" y="110" width="80" height="8" rx="4" fill="currentColor" opacity="0.2"/>
      <circle cx="160" cy="100" r="20" fill="currentColor" opacity="0.1"/>
      <path d="M150 100 L160 110 L170 90" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
    </svg>
  ),
  '3': (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="60" width="120" height="80" rx="8" fill="currentColor" opacity="0.1"/>
      <line x1="60" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <line x1="60" y1="100" x2="140" y2="100" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <line x1="60" y1="120" x2="140" y2="120" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <rect x="50" y="70" width="8" height="8" fill="currentColor" opacity="0.4"/>
      <rect x="50" y="90" width="8" height="8" fill="currentColor" opacity="0.4"/>
      <rect x="50" y="110" width="8" height="8" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  '4': (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="80" r="30" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="currentColor" fillOpacity="0.05"/>
      <path d="M70 80 L100 50 L130 80" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="50" y="120" width="100" height="30" rx="4" fill="currentColor" opacity="0.1"/>
      <rect x="60" y="130" width="20" height="10" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="90" y="130" width="20" height="10" rx="2" fill="currentColor" opacity="0.2"/>
      <rect x="120" y="130" width="20" height="10" rx="2" fill="currentColor" opacity="0.2"/>
    </svg>
  ),
  '5': (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="50" width="140" height="100" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <rect x="40" y="60" width="50" height="30" rx="4" fill="currentColor" opacity="0.1"/>
      <rect x="100" y="60" width="60" height="15" rx="2" fill="currentColor" opacity="0.1"/>
      <rect x="100" y="80" width="60" height="15" rx="2" fill="currentColor" opacity="0.1"/>
      <path d="M50 110 L150 110" stroke="currentColor" strokeWidth="2" opacity="0.2" strokeDasharray="4 4"/>
      <circle cx="70" cy="130" r="8" fill="currentColor" opacity="0.2"/>
      <circle cx="100" cy="130" r="8" fill="currentColor" opacity="0.2"/>
      <circle cx="130" cy="130" r="8" fill="currentColor" opacity="0.2"/>
    </svg>
  ),
  '6': (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="60" width="100" height="80" rx="8" fill="currentColor" opacity="0.1"/>
      <line x1="70" y1="80" x2="130" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <line x1="70" y1="100" x2="130" y2="100" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <line x1="70" y1="120" x2="130" y2="120" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <rect x="60" y="75" width="6" height="6" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="60" y="95" width="6" height="6" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="60" y="115" width="6" height="6" rx="1" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  '7': (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="70" cy="80" r="25" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="currentColor" fillOpacity="0.05"/>
      <circle cx="130" cy="80" r="25" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="currentColor" fillOpacity="0.05"/>
      <path d="M90 80 L110 80" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      <path d="M95 75 L110 80 L95 85" stroke="currentColor" strokeWidth="2" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="60" y="120" width="80" height="40" rx="4" fill="currentColor" opacity="0.1"/>
      <line x1="70" y1="130" x2="130" y2="130" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <line x1="70" y1="145" x2="130" y2="145" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  ),
};

const ProblemCard = ({ problem, onClick }: ProblemCardProps) => {
  const illustration = illustrations[problem.id as keyof typeof illustrations];
  
  return (
    <article 
      className={styles.card}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={styles.cardContent}>
        <div className={styles.contentColumn}>
          <h3 className={styles.cardTitle}>{problem.title}</h3>
          <p className={styles.cardDescription}>{problem.description}</p>
          {problem.techStack && problem.techStack.length > 0 && (
            <>
              <div className={styles.divider}></div>
              <div className={styles.techStack}>
                {problem.techStack.map((tech, index) => (
                  <span key={index} className={styles.techItem}>
                    {tech}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        {illustration && (
          <div className={styles.illustrationColumn}>
            <div className={styles.illustration}>
              {illustration}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProblemCard;

