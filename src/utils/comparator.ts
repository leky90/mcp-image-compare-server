import pixelmatch from 'pixelmatch';
import path from 'path';
import fs from 'fs';
import { ImageData, ComparisonOptions, ComparisonResult } from '../types.js';
import { saveImageAsPNG } from './image-loader.js';

/**
 * Compare two images pixel by pixel
 */
export function comparePixels(
    img1: ImageData,
    img2: ImageData,
    options: ComparisonOptions = {},
    diffOutputPath?: string
): ComparisonResult {
    try {
        // Validate that images have the same dimensions
        if (img1.width !== img2.width || img1.height !== img2.height) {
            return {
                success: false,
                diffPixels: 0,
                totalPixels: 0,
                percentDiff: 0,
                width: 0,
                height: 0,
                message: 'Images must have the same dimensions',
                error: `Image 1: ${img1.width}x${img1.height}, Image 2: ${img2.width}x${img2.height}`
            };
        }

        const { width, height } = img1;
        const totalPixels = width * height;

        // Create diff image buffer
        const diff = new Uint8Array(width * height * 4);

        // Set default options
        const pixelmatchOptions = {
            threshold: options.threshold ?? 0.1,
            includeAA: options.includeAA ?? false,
            alpha: options.alpha ?? 0.1,
            aaColor: options.aaColor ?? [255, 255, 0] as [number, number, number],
            diffColor: options.diffColor ?? [255, 0, 0] as [number, number, number],
            diffColorAlt: options.diffColorAlt ?? undefined,
            diffMask: options.diffMask ?? false
        };

        // Run pixelmatch comparison
        const diffPixels = pixelmatch(
            img1.data,
            img2.data,
            diff,
            width,
            height,
            pixelmatchOptions
        );

        // Calculate percentage difference
        const percentDiff = (diffPixels / totalPixels) * 100;

        // Save diff image if output path provided
        let savedDiffPath: string | undefined;
        if (diffOutputPath) {
            // Ensure directory exists
            const dir = path.dirname(diffOutputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            saveImageAsPNG({ data: diff, width, height }, diffOutputPath);
            savedDiffPath = diffOutputPath;
        }

        return {
            success: true,
            diffPixels,
            totalPixels,
            percentDiff: Number(percentDiff.toFixed(4)),
            width,
            height,
            diffImagePath: savedDiffPath,
            message: `Comparison completed: ${diffPixels} pixels differ (${percentDiff.toFixed(2)}%)`
        };
    } catch (error) {
        return {
            success: false,
            diffPixels: 0,
            totalPixels: 0,
            percentDiff: 0,
            width: 0,
            height: 0,
            message: 'Comparison failed',
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

