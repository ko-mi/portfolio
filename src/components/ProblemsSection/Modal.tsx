import { useEffect } from 'react';
import { ProblemCard } from '../../types';
import styles from './Modal.module.css';

interface ModalProps {
  card: ProblemCard | null;
  onClose: () => void;
}

const Modal = ({ card, onClose }: ModalProps) => {
  useEffect(() => {
    if (card) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [card]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && card) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [card, onClose]);

  if (!card) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <div className={styles.modalContent}>
          <h2 id="modal-title" className={styles.modalTitle}>{card.title}</h2>
          
          {card.problem && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Problem</h3>
              <p className={styles.sectionText}>{card.problem}</p>
            </div>
          )}

          {card.solution && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Solution</h3>
              <p className={styles.sectionText}>{card.solution}</p>
            </div>
          )}

          {card.result && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Result</h3>
              <p className={styles.sectionText}>{card.result}</p>
            </div>
          )}

          {card.techStack && card.techStack.length > 0 && (
            <div className={styles.techStack}>
              <h3 className={styles.sectionTitle}>Tools Used</h3>
              <div className={styles.techList}>
                {card.techStack.map((tech, index) => (
                  <span key={index} className={styles.techItem}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;


