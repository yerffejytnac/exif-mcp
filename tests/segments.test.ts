import { describe, it, expect } from 'vitest';
import { 
  buildOptions, 
  buildExifOptions, 
  buildXmpOptions, 
  buildSegmentOptions 
} from '../src/tools/segments.js';

describe('Segment Option Builders', () => {
  describe('buildOptions function', () => {
    it('should enable all options when no segments specified', () => {
      const options = buildOptions();
      
      expect(options.tiff).toBe(true);
      expect(options.xmp).toBe(true);
      expect(options.icc).toBe(true);
      expect(options.iptc).toBe(true);
      expect(options.jfif).toBe(true);
      expect(options.ihdr).toBe(true);
    });
    
    it('should enable all options when empty array provided', () => {
      const options = buildOptions([]);
      
      expect(options.tiff).toBe(true);
      expect(options.xmp).toBe(true);
      expect(options.icc).toBe(true);
      expect(options.iptc).toBe(true);
      expect(options.jfif).toBe(true);
      expect(options.ihdr).toBe(true);
    });
    
    it('should enable only EXIF when EXIF segment requested', () => {
      const options = buildOptions(['EXIF']);
      
      expect(options.tiff).toBe(true);
      expect(options.xmp).toBe(false);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
    });
    
    it('should enable only GPS when GPS segment requested', () => {
      const options = buildOptions(['GPS']);
      
      expect(options.tiff).toBe(true);
      expect(options.xmp).toBe(false);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
    });
    
    it('should enable only XMP when XMP segment requested', () => {
      const options = buildOptions(['XMP']);
      
      expect(options.tiff).toBe(false);
      expect(options.xmp).toBe(true);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
    });
    
    it('should enable multiple segments when requested', () => {
      const options = buildOptions(['EXIF', 'XMP', 'ICC']);
      
      expect(options.tiff).toBe(true);
      expect(options.xmp).toBe(true);
      expect(options.icc).toBe(true);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
    });
    
    it('should enable all segments when all are requested', () => {
      const options = buildOptions(['EXIF', 'GPS', 'XMP', 'ICC', 'IPTC', 'JFIF', 'IHDR']);
      
      expect(options.tiff).toBe(true);
      expect(options.xmp).toBe(true);
      expect(options.icc).toBe(true);
      expect(options.iptc).toBe(true);
      expect(options.jfif).toBe(true);
      expect(options.ihdr).toBe(true);
    });
  });
  
  describe('buildExifOptions function', () => {
    it('should create correct options for EXIF reading without pick', () => {
      const options = buildExifOptions();
      
      expect(options.tiff).toBe(true);
      expect(options.xmp).toBe(false);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
      expect(options.pick).toBeUndefined();
    });
    
    it('should include pick list when provided', () => {
      const pickList = ['Make', 'Model', 'ExposureTime'];
      const options = buildExifOptions(pickList);
      
      expect(options.tiff).toBe(true);
      expect(options.xmp).toBe(false);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
      expect(options.pick).toEqual(pickList);
    });
  });
  
  describe('buildXmpOptions function', () => {
    it('should create correct options for XMP reading with multiSegment disabled by default', () => {
      const options = buildXmpOptions();
      
      expect(options.tiff).toBe(false);
      expect(options.xmp).toBe(true);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
      expect(options.multiSegment).toBe(false);
    });
    
    it('should enable multiSegment when extended is true', () => {
      const options = buildXmpOptions(true);
      
      expect(options.tiff).toBe(false);
      expect(options.xmp).toBe(true);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
      expect(options.multiSegment).toBe(true);
    });
  });
  
  describe('buildSegmentOptions function', () => {
    it('should create correct options for ICC segment', () => {
      const options = buildSegmentOptions('ICC');
      
      expect(options.tiff).toBe(false);
      expect(options.xmp).toBe(false);
      expect(options.icc).toBe(true);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
    });
    
    it('should create correct options for IPTC segment', () => {
      const options = buildSegmentOptions('IPTC');
      
      expect(options.tiff).toBe(false);
      expect(options.xmp).toBe(false);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(true);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(false);
    });
    
    it('should create correct options for JFIF segment', () => {
      const options = buildSegmentOptions('JFIF');
      
      expect(options.tiff).toBe(false);
      expect(options.xmp).toBe(false);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(true);
      expect(options.ihdr).toBe(false);
    });
    
    it('should create correct options for IHDR segment', () => {
      const options = buildSegmentOptions('IHDR');
      
      expect(options.tiff).toBe(false);
      expect(options.xmp).toBe(false);
      expect(options.icc).toBe(false);
      expect(options.iptc).toBe(false);
      expect(options.jfif).toBe(false);
      expect(options.ihdr).toBe(true);
    });
  });
});