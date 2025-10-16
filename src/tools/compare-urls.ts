import path from 'path';
import fs from 'fs';
import { loadImage, normalizeImages } from '../utils/image-loader.js';
import { captureScreenshot } from '../utils/screenshot.js';
import { comparePixels } from '../utils/comparator.js';
import { ComparisonResult } from '../types.js';

export interface CompareUrlsArgs {
    url1: string;
    url2: string;
    diff_output_path?: string;
    threshold?: number;
    includeAA?: boolean;
}

/**
 * Compare screenshots from two URLs
 */
export async function compareUrls(args: CompareUrlsArgs): Promise<ComparisonResult> {
    let screenshot1Path: string | null = null;
    let screenshot2Path: string | null = null;

    try {
        const {
            url1,
            url2,
            diff_output_path,
            threshold = 0.1,
            includeAA = false
        } = args;

        // Validate inputs
        if (!url1 || !url2) {
            return {
                success: false,
                diffPixels: 0,
                totalPixels: 0,
                percentDiff: 0,
                width: 0,
                height: 0,
                message: 'Both URLs are required',
                error: 'Missing url1 or url2'
            };
        }

        // Capture screenshots from both URLs
        screenshot1Path = path.join(process.cwd(), `screenshot1-${Date.now()}.png`);
        screenshot2Path = path.join(process.cwd(), `screenshot2-${Date.now()}.png`);

        await captureScreenshot(url1, screenshot1Path);
        await captureScreenshot(url2, screenshot2Path);

        // Load both screenshots
        const img1 = await loadImage(screenshot1Path);
        const img2 = await loadImage(screenshot2Path);

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
            message: 'Failed to compare URLs',
            error: error instanceof Error ? error.message : String(error)
        };
    } finally {
        // Clean up temporary screenshots
        if (screenshot1Path && fs.existsSync(screenshot1Path)) {
            fs.unlinkSync(screenshot1Path);
        }
        if (screenshot2Path && fs.existsSync(screenshot2Path)) {
            fs.unlinkSync(screenshot2Path);
        }
    }
}

