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
    
    function getBaseUrl() {
      const url = process.env.NEXT_PUBLIC_STRAPI_URL;
      if (!url) throw new Error('Missing NEXT_PUBLIC_STRAPI_URL');
      return url.replace(/\/$/, '');
    }
    
    export async function fetchProjects(): Promise<StrapiProject[]> {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/api/projects?sort=sortOrder:asc`);
      if (!res.ok) throw new Error(`Strapi /api/projects failed: ${res.status}`);
    
      const json = await res.json();
    
      // Strapi commonly returns { data: [...] }. Be tolerant in case it’s a raw array.
      const data = Array.isArray(json) ? json : (json?.data ?? json?.results ?? []);
      if (!Array.isArray(data)) return [];
      return data as StrapiProject[];
    }