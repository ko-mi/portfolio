import { NextResponse } from 'next/server';
import type { ProblemCard } from '@/types';
import type { StrapiProject } from '@/services/strapi';

/**
 * Server-side Route Handler for fetching projects from Strapi.
 * This endpoint is called internally by Next.js server components.
 * The API token never reaches the browser.
 */
export async function GET() {
  const strapiUrl = process.env.STRAPI_URL;
  const strapiToken = process.env.STRAPI_API_TOKEN;

  if (!strapiUrl) {
    console.error('Missing STRAPI_URL environment variable');
    return NextResponse.json(
      { error: 'CMS configuration error' },
      { status: 500 }
    );
  }

  if (!strapiToken) {
    console.error('Missing STRAPI_API_TOKEN environment variable');
    return NextResponse.json(
      { error: 'CMS authentication error' },
      { status: 500 }
    );
  }

  try {
    const url = `${strapiUrl.replace(/\/$/, '')}/api/projects?sort=sortOrder:asc`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
      signal: controller.signal,
      next: { revalidate: 300 }, // ISR: 5 minutes
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Strapi API failed: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: 'Failed to fetch projects from CMS' },
        { status: response.status }
      );
    }

    const json = await response.json();
    const data = Array.isArray(json) ? json : (json?.data ?? []);

    if (!Array.isArray(data)) {
      console.error('Unexpected response format from Strapi');
      return NextResponse.json(
        { error: 'Invalid CMS response format' },
        { status: 500 }
      );
    }

    // Transform Strapi response to ProblemCard format
    const projects: ProblemCard[] = (data as StrapiProject[]).map((p) => ({
      id: String(p.sortOrder ?? p.id),
      title: p.title,
      tabLabel: p.tabLabel,
      description: p.description ?? '',
      problem: p.problem,
      solution: p.solution,
      result: p.result,
      techStack: p.techStack,
    }));

    return NextResponse.json({ data: projects });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Strapi request timed out');
      return NextResponse.json(
        { error: 'CMS request timeout' },
        { status: 504 }
      );
    }

    console.error('Error fetching from Strapi:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
