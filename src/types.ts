export interface ImageData {
    data: Uint8Array | Uint8ClampedArray;
    width: number;
    height: number;
}

export interface ComparisonOptions {
    threshold?: number;
    includeAA?: boolean;
    alpha?: number;
    aaColor?: [number, number, number];
    diffColor?: [number, number, number];
    diffColorAlt?: [number, number, number] | null;
    diffMask?: boolean;
}

export interface ComparisonResult {
    success: boolean;
    diffPixels: number;
    totalPixels: number;
    percentDiff: number;
    width: number;
    height: number;
    diffImagePath?: string;
    message: string;
    error?: string;
}

export interface ScreenshotOptions {
    fullPage?: boolean;
    timeout?: number;
}

