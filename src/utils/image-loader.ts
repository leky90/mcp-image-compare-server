import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import sharp from 'sharp';
import { ImageData } from '../types.js';

/**
 * Load image from file path (supports PNG and JPEG)
 */
export async function loadImage(imagePath: string): Promise<ImageData> {
    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
    }

    const ext = path.extname(imagePath).toLowerCase();

    if (ext === '.png') {
        return loadPNG(imagePath);
    } else if (ext === '.jpg' || ext === '.jpeg') {
        return loadJPEG(imagePath);
    } else {
        throw new Error(`Unsupported image format: ${ext}. Only PNG and JPEG are supported.`);
    }
}

/**
 * Load PNG image
 */
function loadPNG(imagePath: string): ImageData {
    const buffer = fs.readFileSync(imagePath);
    const png = PNG.sync.read(buffer);

    return {
        data: png.data,
        width: png.width,
        height: png.height
    };
}

/**
 * Load JPEG image and convert to PNG format
 */
async function loadJPEG(imagePath: string): Promise<ImageData> {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error('Unable to read image dimensions');
    }

    // Convert JPEG to raw RGBA buffer
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    return {
        data: new Uint8Array(data),
        width: info.width,
        height: info.height
    };
}

/**
 * Normalize two images to have the same dimensions
 * Resizes the larger image to match the smaller one
 */
export async function normalizeImages(
    img1: ImageData,
    img2: ImageData
): Promise<{ img1: ImageData; img2: ImageData }> {
    // If dimensions match, return as-is
    if (img1.width === img2.width && img1.height === img2.height) {
        return { img1, img2 };
    }

    // Determine target dimensions (use the smaller of the two)
    const targetWidth = Math.min(img1.width, img2.width);
    const targetHeight = Math.min(img1.height, img2.height);

    // Resize images if needed
    const resizedImg1 = img1.width !== targetWidth || img1.height !== targetHeight
        ? await resizeImage(img1, targetWidth, targetHeight)
        : img1;

    const resizedImg2 = img2.width !== targetWidth || img2.height !== targetHeight
        ? await resizeImage(img2, targetWidth, targetHeight)
        : img2;

    return { img1: resizedImg1, img2: resizedImg2 };
}

/**
 * Resize image to target dimensions
 */
async function resizeImage(
    img: ImageData,
    targetWidth: number,
    targetHeight: number
): Promise<ImageData> {
    // Create PNG from raw data
    const png = new PNG({ width: img.width, height: img.height });
    png.data = Buffer.from(img.data);

    // Convert to buffer
    const buffer = PNG.sync.write(png);

    // Resize using sharp
    const resized = await sharp(buffer)
        .resize(targetWidth, targetHeight, { fit: 'fill' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    return {
        data: new Uint8Array(resized.data),
        width: resized.info.width,
        height: resized.info.height
    };
}

/**
 * Save image data as PNG file
 */
export function saveImageAsPNG(
    imageData: ImageData,
    outputPath: string
): void {
    const png = new PNG({ width: imageData.width, height: imageData.height });
    png.data = Buffer.from(imageData.data);

    const buffer = PNG.sync.write(png);
    fs.writeFileSync(outputPath, buffer);
}

