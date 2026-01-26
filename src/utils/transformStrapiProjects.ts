import type { ProblemCard } from '@/types';
import type { ValidatedStrapiProject } from './strapiValidation';

/**
 * Transforms validated Strapi project data to ProblemCard format.
 * 
 * This utility ensures consistent transformation across the application,
 * reducing duplication and making it easier to maintain the data mapping.
 * 
 * @param data - Array of validated Strapi project objects
 * @returns Array of ProblemCard objects suitable for UI rendering
 * 
 * @example
 * ```typescript
 * const validatedData = await fetchAndValidateFromStrapi();
 * const projects = transformStrapiProjects(validatedData);
 * ```
 */
export function transformStrapiProjects(data: ValidatedStrapiProject[]): ProblemCard[] {
  return data.map((p) => ({
    id: String(p.sortOrder ?? p.id),
    title: p.title,
    tabLabel: p.tabLabel,
    description: p.description ?? '',
    problem: p.problem,
    solution: p.solution,
    result: p.result,
    techStack: p.techStack,
  }));
}
