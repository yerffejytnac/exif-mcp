import { z } from 'zod';

// Define image source types
export interface ImageSourceType {
  kind: 'path' | 'url' | 'base64' | 'buffer';
  path?: string;
  url?: string;
  data?: string;
  buffer?: string;
}

// Define schemas for various tool parameters
export const ReadMetadataSchema = z.object({
  image: z.object({
    kind: z.enum(['path', 'url', 'base64', 'buffer']),
    path: z.string().optional(),
    url: z.string().optional(),
    data: z.string().optional(),
    buffer: z.string().optional()
  }),
  segments: z.array(z.enum(['EXIF', 'GPS', 'XMP', 'ICC', 'IPTC', 'JFIF', 'IHDR'])).optional()
});

export const ReadExifSchema = z.object({
  image: z.object({
    kind: z.enum(['path', 'url', 'base64', 'buffer']),
    path: z.string().optional(),
    url: z.string().optional(),
    data: z.string().optional(),
    buffer: z.string().optional()
  }),
  pick: z.array(z.string()).optional()
});

export const ReadXmpSchema = z.object({
  image: z.object({
    kind: z.enum(['path', 'url', 'base64', 'buffer']),
    path: z.string().optional(),
    url: z.string().optional(),
    data: z.string().optional(),
    buffer: z.string().optional()
  }),
  extended: z.boolean().optional()
});

export const BasicImageSchema = z.object({
  image: z.object({
    kind: z.enum(['path', 'url', 'base64', 'buffer']),
    path: z.string().optional(),
    url: z.string().optional(),
    data: z.string().optional(),
    buffer: z.string().optional()
  })
});

export const ThumbnailSchema = z.object({
  image: z.object({
    kind: z.enum(['path', 'url', 'base64', 'buffer']),
    path: z.string().optional(),
    url: z.string().optional(),
    data: z.string().optional(),
    buffer: z.string().optional()
  }),
  url: z.boolean().optional()
});