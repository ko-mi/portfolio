import { z } from 'zod';

/**
 * Zod schema for validating Strapi project responses.
 * 
 * This provides runtime type checking to ensure the data from the CMS
 * matches our expected structure before transforming it for the UI.
 */
export const StrapiProjectSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  title: z.string(),
  tabLabel: z.string().optional(),
  description: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  result: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
  slug: z.string().optional(),
  publishedAt: z.string().nullable().optional(),
});

/**
 * Schema for the Strapi API response format.
 * Strapi can return data either as a direct array or wrapped in a data property.
 */
export const StrapiResponseSchema = z.union([
  z.array(StrapiProjectSchema),
  z.object({
    data: z.array(StrapiProjectSchema),
  }),
]);

export type ValidatedStrapiProject = z.infer<typeof StrapiProjectSchema>;
