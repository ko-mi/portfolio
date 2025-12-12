import { useState } from 'react';
import { ProblemCard } from '../../types';
import ProblemCardComponent from './ProblemCard';
import Modal from './Modal';
import styles from './ProblemsSection.module.css';

interface ProblemsSectionProps {
  problems?: ProblemCard[];
}

const defaultProblems: ProblemCard[] = [
  {
    id: '1',
    title: 'Marketing Website Migration to Framer + System Architecture',
    description: 'Led the end-to-end migration of a legacy marketing site to Framer. Designed a scalable CMS and component architecture.',
    problem: 'Legacy website infrastructure was slow to iterate on, inconsistent in design structure, and required constant manual intervention.',
    solution: 'Led the end-to-end migration of the company website to Framer. Designed a scalable CMS architecture supporting dozens of page types. Built reusable custom Framer components + code overrides. Improved internal delivery velocity (marketing could ship pages without engineering). Set standards for accessibility, SEO baseline, and performance.',
    result: 'Page build time reduced from days to hours. Consistent design system adoption across the site. Significant reduction in engineering bottlenecks.',
    techStack: ['Framer', 'Custom components & code overrides', 'CMS architecture', 'SEO & performance best practices'],
  },
  {
    id: '2',
    title: 'CMS Data Modeling for Complex Content',
    description: 'Designed relational CMS schemas for multiple content libraries. Built dynamic filtering and search components.',
    problem: 'Disjointed content stored across multiple tools → no unified structure → hard to scale.',
    solution: 'Designed relational CMS schemas for multiple content libraries. Built dynamic filtering/search components with React overrides. Implemented S3/logo pipelines, schema versioning, and slug logic.',
    result: 'Automated content delivery → less manual work. Flexible structures supporting new content types without rework. Marketing could publish autonomously while keeping data clean.',
    techStack: ['Framer CMS', 'React overrides', 'JSON data pipelines', 'S3 / asset handling'],
  },
  {
    id: '3',
    title: 'Interactive Demo / Funnel Systems',
    description: 'Built a complete system connecting HubSpot forms, validation, routing logic, and scheduling.',
    problem: 'Lead funnel was fragmented, unreliable, and required developer intervention for every update.',
    solution: 'Built a complete system connecting HubSpot forms, BotPoison validation, routing logic, and Chili Piper scheduling. Implemented custom event tracking for GA4. Created reusable form override logic handling country logic, validation, loading states, and error recovery.',
    result: 'Reduced drop-offs by fixing friction points. Clear attribution → marketing could finally measure funnel health. Forms were maintainable without engineers.',
    techStack: ['HubSpot', 'Chili Piper', 'BotPoison', 'Custom form logic', 'GA4 events'],
  },
  {
    id: '4',
    title: 'Analytics Infrastructure + Custom Event Architecture',
    description: 'Implemented a full GA4 event architecture with naming conventions, parameters, and context.',
    problem: "Leadership didn't have visibility into which pages, CTAs, and content produced conversions.",
    solution: 'Implemented a full GA4 event architecture (naming conventions, parameters, context). Instrumented key pages, demos, forms, and CTAs with structured, scalable tagging. Built internal documentation + dashboards.',
    result: 'Clear insight into acquisition → demo → signup funnel. Enabled actual experiment cycles (A/B testing, CRO). Reduced internal confusion about "what works."',
    techStack: ['GA4', 'Google Tag Manager', 'Event schemas', 'Internal dashboards'],
  },
  {
    id: '7',
    title: 'Cross-Team Collaboration & Bridging Technical/Non-Technical Roles',
    description: 'Acted as the translation layer between marketing, design, growth, and engineering.',
    problem: 'Marketing team relied on engineering for anything technical → delays + miscommunication.',
    solution: 'Became the "bridge" — translating requirements between design, content, growth, and engineering. Set internal processes for page requests, QA, rollout, and analytics tagging. Increased autonomy of the entire GTM team.',
    result: 'Faster delivery. Fewer misunderstandings. More ownership across the team.',
    techStack: ['Process design', 'Technical documentation', 'Cross-team collaboration'],
  },
];

const ProblemsSection = ({ problems = defaultProblems }: ProblemsSectionProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCard, setSelectedCard] = useState<ProblemCard | null>(null);

  const handleCardClick = (card: ProblemCard) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  // Short tab names
  const tabNames = [
    'Website Migration',
    'CMS Modeling',
    'Lead Funnel',
    'Analytics',
    'Collaboration',
  ];

  return (
    <section className={styles.problemsSection} id="problems">
      <h2 className={styles.heading}>Portfolio</h2>
      <div className={styles.tabbedLayout}>
        <div className={styles.tabs}>
          {problems.map((card, index) => (
            <button
              key={card.id}
              className={`${styles.tab} ${index === activeTab ? styles.active : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tabNames[index] || card.title}
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

