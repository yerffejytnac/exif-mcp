import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadImage } from '../src/tools/loaders.js';

// Get current directory to reference fixtures
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, 'fixtures');
const sampleJpegPath = path.join(fixturesDir, 'sample.jpg');

// Create mock test image
beforeAll(() => {
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  
  // Create a simple 1x1 pixel JPEG if it doesn't exist
  if (!fs.existsSync(sampleJpegPath)) {
    // This is a minimal valid JPEG file (1x1 pixel)
    const minimalJpeg = Buffer.from(
      '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==',
      'base64'
    );
    fs.writeFileSync(sampleJpegPath, minimalJpeg);
  }
});

describe('Image Loaders', () => {
  describe('loadImage function', () => {
    // Test loading from file path
    it('should load an image from filesystem path', async () => {
      const buf = await loadImage({
        kind: 'path',
        path: sampleJpegPath
      });
      
      expect(buf).toBeInstanceOf(Buffer);
      expect(buf.length).toBeGreaterThan(0);
    });

    // Test loading from file URL
    it('should load an image from file:// URL', async () => {
      const fileUrl = `file://${sampleJpegPath.replace(/\\/g, '/')}`;
      const buf = await loadImage({
        kind: 'url',
        url: fileUrl
      });
      
      expect(buf).toBeInstanceOf(Buffer);
      expect(buf.length).toBeGreaterThan(0);
    });
    
    // Test loading from base64
    it('should load an image from base64 data', async () => {
      // Read the test image into base64
      const fileContent = fs.readFileSync(sampleJpegPath);
      const base64Data = fileContent.toString('base64');
      
      const buf = await loadImage({
        kind: 'base64',
        data: base64Data
      });
      
      expect(buf).toBeInstanceOf(Buffer);
      expect(buf.length).toBeGreaterThan(0);
      
      // The loaded buffer should match the original file
      expect(Buffer.compare(buf, fileContent)).toBe(0);
    });

    // Test loading from base64 with data URI format
    it('should load an image from data URI', async () => {
      const fileContent = fs.readFileSync(sampleJpegPath);
      const base64Data = fileContent.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64Data}`;
      
      const buf = await loadImage({
        kind: 'base64',
        data: dataUri
      });
      
      expect(buf).toBeInstanceOf(Buffer);
      expect(buf.length).toBeGreaterThan(0);
      
      // The loaded buffer should match the original file
      expect(Buffer.compare(buf, fileContent)).toBe(0);
    });

    // Test loading from buffer (base64-encoded string)
    it('should load an image from buffer parameter', async () => {
      const fileContent = fs.readFileSync(sampleJpegPath);
      const base64Data = fileContent.toString('base64');
      
      const buf = await loadImage({
        kind: 'buffer',
        buffer: base64Data
      });
      
      expect(buf).toBeInstanceOf(Buffer);
      expect(buf.length).toBeGreaterThan(0);
      
      // The loaded buffer should match the original file
      expect(Buffer.compare(buf, fileContent)).toBe(0);
    });

    // Test error handling - non-existent file
    it('should throw an error for non-existent files', async () => {
      await expect(loadImage({
        kind: 'path',
        path: '/this/path/does/not/exist.jpg'
      })).rejects.toThrow();
    });

    // Test error handling - oversized base64 payload
    it('should reject oversized base64 payloads', async () => {
      // Mock a large base64 string (> 30MB)
      const largeBase64 = 'A'.repeat(40000001);
      
      await expect(loadImage({
        kind: 'base64',
        data: largeBase64
      })).rejects.toThrow('PayloadTooLarge');
    });
    
    // Test HTTP fetch with mock
    it('should handle HTTP URLs correctly', async () => {
      // Mock the fetch function
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: async () => {
          const fileContent = fs.readFileSync(sampleJpegPath);
          return fileContent.buffer.slice(
            fileContent.byteOffset,
            fileContent.byteOffset + fileContent.byteLength
          );
        }
      });
      
      const buf = await loadImage({
        kind: 'url',
        url: 'https://example.com/image.jpg'
      });
      
      expect(global.fetch).toHaveBeenCalledWith('https://example.com/image.jpg');
      expect(buf).toBeInstanceOf(Uint8Array);
      expect(buf.length).toBeGreaterThan(0);
    });
    
    // Test HTTP fetch error
    it('should handle HTTP fetch errors', async () => {
      // Mock the fetch function to simulate an error
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });
      
      await expect(loadImage({
        kind: 'url',
        url: 'https://example.com/not-found.jpg'
      })).rejects.toThrow('404 Not Found');
    });
  });
});