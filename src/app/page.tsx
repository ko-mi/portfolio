import App from '../App';
import { defaultProblems } from '../content/defaultProblems';
import type { ProblemCard } from '../types';
import { transformStrapiProjects } from '../utils/transformStrapiProjects';
import { StrapiResponseSchema } from '../utils/strapiValidation';

// Enable ISR: regenerate page every 5 minutes
export const revalidate = 300;

/**
 * Server-side data fetching for projects with runtime validation.
 * Falls back to defaultProblems if CMS is unavailable or data is invalid.
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

    // Validate the response structure at runtime
    const validationResult = StrapiResponseSchema.safeParse(json);

    if (!validationResult.success) {
      console.error('Invalid Strapi response format:', validationResult.error);
      return defaultProblems;
    }

    // Extract the data array from validated response
    const data = Array.isArray(validationResult.data)
      ? validationResult.data
      : validationResult.data.data;

    if (data.length === 0) {
      console.warn('No projects returned from CMS, using defaults');
      return defaultProblems;
    }

    // Transform validated Strapi response to ProblemCard format
    const projects = transformStrapiProjects(data);

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