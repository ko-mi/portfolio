export interface ProblemCard {
  id: string;
  title: string;
  description: string;
  techStack?: string[]; // Array of tech names (e.g., ['Vercel', 'Framer', 'Hubspot'])
  tabLabel?: string;
  // Modal content
  problem?: string;
  solution?: string;
  result?: string;
  // Future CMS fields:
  // slug?: string;
  // link?: string;
  // tags?: string[];
}

export interface MenuItem {
  label: string;
  href: string;
  external?: boolean;
}

