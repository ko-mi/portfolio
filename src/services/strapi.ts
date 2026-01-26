/**
 * Server-side Strapi service.
 * This module is now primarily used server-side with API token authentication.
 * 
 * For client-side needs, use the /api/projects Route Handler instead.
 */

export type StrapiProject = {
  id: number;
  documentId: string;
  title: string;
  tabLabel?: string;
  description?: string;
  problem?: string;
  solution?: string;
  result?: string;
  techStack?: string[];
  sortOrder?: number;
  slug?: string;
  publishedAt?: string | null;
};

/**
 * Fetch projects from Strapi (server-side only).
 * Requires STRAPI_URL and STRAPI_API_TOKEN environment variables.
 * 
 * @throws {Error} If environment variables are missing or fetch fails
 */
export async function fetchProjects(): Promise<StrapiProject[]> {
  const strapiUrl = process.env.STRAPI_URL;
  const strapiToken = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl) {
    throw new Error('Missing STRAPI_URL environment variable');
  }

  if (!strapiToken) {
    throw new Error('Missing STRAPI_API_TOKEN environment variable');
  }

  const url = `${strapiUrl.replace(/\/$/, '')}/api/projects?sort=sortOrder:asc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${strapiToken}`,
    },
    next: { revalidate: 300 }, // ISR: 5 minutes
  });

  if (!response.ok) {
    throw new Error(`Strapi /api/projects failed: ${response.status}`);
  }

  const json = await response.json();

  // Strapi commonly returns { data: [...] }
  const data = Array.isArray(json) ? json : (json?.data ?? json?.results ?? []);
  
  if (!Array.isArray(data)) {
    return [];
  }

  return data as StrapiProject[];
}
