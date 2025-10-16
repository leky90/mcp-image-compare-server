import path from 'path';
import { loadImage, normalizeImages } from '../utils/image-loader.js';
import { comparePixels } from '../utils/comparator.js';
import { ComparisonResult } from '../types.js';

export interface CompareImagesArgs {
    image1_path: string;
    image2_path: string;
    diff_output_path?: string;
    threshold?: number;
    includeAA?: boolean;
}

/**
 * Compare two local image files
 */
export async function compareImages(args: CompareImagesArgs): Promise<ComparisonResult> {
    try {
        const {
            image1_path,
            image2_path,
            diff_output_path,
            threshold = 0.1,
            includeAA = false
        } = args;

        // Validate input paths
        if (!image1_path || !image2_path) {
            return {
                success: false,
                diffPixels: 0,
                totalPixels: 0,
                percentDiff: 0,
                width: 0,
                height: 0,
                message: 'Both image paths are required',
                error: 'Missing image1_path or image2_path'
            };
        }

        // Load both images
        const img1 = await loadImage(image1_path);
        const img2 = await loadImage(image2_path);

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
            message: 'Failed to compare images',
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

