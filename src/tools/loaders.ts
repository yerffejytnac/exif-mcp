import fs from 'fs';
import { ImageSourceType } from '../types/image.js';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Loads an image from various source types into a Buffer or Uint8Array
 * @param src ImageSource object specifying how to load the image
 * @returns Promise resolving to Buffer or Uint8Array containing the image data
 */
export async function loadImage(src: ImageSourceType): Promise<Buffer | Uint8Array> {
  try {
    switch (src.kind) {
      case 'path':
        if (!src.path) {
          throw new Error('Path is required for kind="path"');
        }
        return await fs.promises.readFile(src.path);
      
      case 'url':
        if (!src.url) {
          throw new Error('URL is required for kind="url"');
        }
        
        if (src.url.startsWith('file://')) {
          // Handle file:// URLs by converting to filesystem path
          const filePath = fileURLToPath(src.url);
          return await fs.promises.readFile(filePath);
        } else {
          // Handle HTTP/HTTPS URLs
          const response = await fetch(src.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
          }
          return new Uint8Array(await response.arrayBuffer());
        }
      
      case 'base64':
        if (!src.data) {
          throw new Error('Data is required for kind="base64"');
        }
        
        // Check for potential oversized base64 string (>30MB)
        if (src.data.length > 40000000) { // ~30MB in base64
          throw new Error('PayloadTooLarge: Base64 data exceeds 30MB limit');
        }
        
        // Handle data URIs or raw base64
        if (src.data.startsWith('data:')) {
          const base64Data = src.data.split(',')[1];
          return Buffer.from(base64Data, 'base64');
        } else {
          return Buffer.from(src.data, 'base64');
        }
      
      case 'buffer':
        if (!src.buffer) {
          throw new Error('Buffer is required for kind="buffer"');
        }
        return Buffer.from(src.buffer, 'base64');
      
      default:
        // This should never happen due to type constraints, but TypeScript needs it
        throw new Error(`Unsupported image source kind: ${(src as any).kind}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load image: ${error.message}`);
    }
    throw error;
  }
}