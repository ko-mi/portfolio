import App from '../App';
import { defaultProblems } from '../content/defaultProblems';
import type { ProblemCard } from '../types';

// Enable ISR: regenerate page every 5 minutes
export const revalidate = 300;

/**
 * Server-side data fetching for projects.
 * Falls back to defaultProblems if CMS is unavailable.
 */
async function getProjects(): Promise<ProblemCard[]> {
  const strapiUrl = process.env.STRAPI_URL;
  const strapiToken = process.env.STRAPI_API_TOKEN;

  // If CMS is not configured, use fallback data
  if (!strapiUrl || !strapiToken) {
    console.warn('CMS not configured, using default problems');
    return defaultProblems;
  }

  try {
    const url = `${strapiUrl.replace(/\/$/, '')}/api/projects?sort=sortOrder:asc`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
      next: { revalidate: 300 }, // ISR: 5 minutes
    });

    if (!response.ok) {
      console.error(`Strapi fetch failed: ${response.status}`);
      return defaultProblems;
    }

    const json = await response.json();
    const data = Array.isArray(json) ? json : (json?.data ?? []);

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No projects returned from CMS, using defaults');
      return defaultProblems;
    }

    // Transform Strapi response to ProblemCard format
    const projects: ProblemCard[] = data.map((p: any) => ({
      id: String(p.sortOrder ?? p.id),
      title: p.title,
      tabLabel: p.tabLabel,
      description: p.description ?? '',
      problem: p.problem,
      solution: p.solution,
      result: p.result,
      techStack: p.techStack,
    }));

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return defaultProblems;
  }
}

export default async function Page() {
  const problems = await getProjects();
  
  return <App problems={problems} />;
}