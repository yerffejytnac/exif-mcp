// Define segment types
type SegmentType = 'EXIF' | 'GPS' | 'XMP' | 'ICC' | 'IPTC' | 'JFIF' | 'IHDR';

/**
 * Interface for exifr options
 */
export interface ExifrOptions {
  tiff?: boolean;
  xmp?: boolean;
  icc?: boolean;
  iptc?: boolean;
  jfif?: boolean;
  ihdr?: boolean;
  multiSegment?: boolean;
  pick?: string[];
  [key: string]: any;
}

/**
 * Builds exifr options object based on requested segments
 * @param segments Optional array of segment types to include
 * @returns Options object for exifr
 */
export function buildOptions(segments?: SegmentType[]): ExifrOptions {
  // Default options - include everything if segments not specified
  if (!segments || segments.length === 0) {
    return {
      tiff: true,    // Includes EXIF and GPS
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      ihdr: true,
    };
  }

  // Start with all segments disabled
  const options: ExifrOptions = {
    tiff: false,
    xmp: false,
    icc: false,
    iptc: false,
    jfif: false,
    ihdr: false,
  };

  // Enable requested segments
  segments.forEach(segment => {
    switch (segment) {
      case 'EXIF':
      case 'GPS':
        options.tiff = true;
        break;
      case 'XMP':
        options.xmp = true;
        break;
      case 'ICC':
        options.icc = true;
        break;
      case 'IPTC':
        options.iptc = true;
        break;
      case 'JFIF':
        options.jfif = true;
        break;
      case 'IHDR':
        options.ihdr = true;
        break;
    }
  });

  return options;
}

/**
 * Creates options object for the read-exif tool
 * @param pick Optional array of specific EXIF tags to pick
 * @returns Options object configured for EXIF reading
 */
export function buildExifOptions(pick?: string[]): ExifrOptions {
  return {
    tiff: true,
    xmp: false,
    icc: false,
    iptc: false,
    jfif: false,
    ihdr: false,
    ...(pick ? { pick } : {})
  };
}

/**
 * Creates options object for the read-xmp tool
 * @param extended Whether to read extended XMP segments
 * @returns Options object configured for XMP reading
 */
export function buildXmpOptions(extended?: boolean): ExifrOptions {
  return {
    tiff: false,
    xmp: true,
    icc: false,
    iptc: false,
    jfif: false,
    ihdr: false,
    multiSegment: extended ?? false
  };
}

/**
 * Creates options object for segment-specific tools (ICC, IPTC, JFIF, IHDR)
 * @param segment The segment type to read
 * @returns Options object configured for the specific segment
 */
export function buildSegmentOptions(segment: 'ICC' | 'IPTC' | 'JFIF' | 'IHDR'): ExifrOptions {
  const options: ExifrOptions = {
    tiff: false,
    xmp: false,
    icc: false,
    iptc: false,
    jfif: false,
    ihdr: false,
  };
  
  const key = segment.toLowerCase() as 'icc' | 'iptc' | 'jfif' | 'ihdr';
  options[key] = true;
  
  return options;
}