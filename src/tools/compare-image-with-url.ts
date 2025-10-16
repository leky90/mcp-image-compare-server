import path from 'path';
import fs from 'fs';
import { loadImage, normalizeImages } from '../utils/image-loader.js';
import { captureScreenshot } from '../utils/screenshot.js';
import { comparePixels } from '../utils/comparator.js';
import { ComparisonResult } from '../types.js';

export interface CompareImageWithUrlArgs {
    image_path: string;
    url: string;
    diff_output_path?: string;
    threshold?: number;
    includeAA?: boolean;
}

/**
 * Compare a local image file with a screenshot from a URL
 */
export async function compareImageWithUrl(args: CompareImageWithUrlArgs): Promise<ComparisonResult> {
    let screenshotPath: string | null = null;

    try {
        const {
            image_path,
            url,
            diff_output_path,
            threshold = 0.1,
            includeAA = false
        } = args;

        // Validate inputs
        if (!image_path || !url) {
            return {
                success: false,
                diffPixels: 0,
                totalPixels: 0,
                percentDiff: 0,
                width: 0,
                height: 0,
                message: 'Image path and URL are required',
                error: 'Missing image_path or url'
            };
        }

        // Load local image
        const img1 = await loadImage(image_path);

        // Capture screenshot from URL
        screenshotPath = path.join(process.cwd(), `screenshot-${Date.now()}.png`);
        await captureScreenshot(url, screenshotPath);

        // Load screenshot
        const img2 = await loadImage(screenshotPath);

        // Normalize images to same dimensions
        const { img1: normalizedImg1, img2: normalizedImg2 } = await normalizeImages(img1, img2);

        // Generate default diff output path if not provided
        const diffPath = diff_output_path || path.join(
            process.cwd(),
            `diff-${Date.now()}.png`
        );

        // Compare images
        const result = comparePixels(
            normalizedImg1,
            normalizedImg2,
            { threshold, includeAA },
            diffPath
        );

        return result;
    } catch (error) {
        return {
            success: false,
            diffPixels: 0,
            totalPixels: 0,
            percentDiff: 0,
            width: 0,
            height: 0,
            message: 'Failed to compare image with URL',
            error: error instanceof Error ? error.message : String(error)
        };
    } finally {
        // Clean up temporary screenshot
        if (screenshotPath && fs.existsSync(screenshotPath)) {
            fs.unlinkSync(screenshotPath);
        }
    }
}

