import { chromium, Browser, Page } from 'playwright';
import { ScreenshotOptions } from '../types.js';

let browser: Browser | null = null;

/**
 * Initialize browser instance
 */
async function initBrowser(): Promise<Browser> {
    if (!browser) {
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
    return browser;
}

/**
 * Capture screenshot of a URL
 */
export async function captureScreenshot(
    url: string,
    outputPath: string,
    options: ScreenshotOptions = {}
): Promise<void> {
    const { fullPage = true, timeout = 30000 } = options;

    let page: Page | null = null;

    try {
        const browserInstance = await initBrowser();
        page = await browserInstance.newPage();

        // Set viewport size for consistent screenshots
        await page.setViewportSize({ width: 1280, height: 720 });

        // Navigate to URL
        await page.goto(url, {
            waitUntil: 'networkidle',
            timeout
        });

        // Wait a bit for any animations to complete
        await page.waitForTimeout(1000);

        // Take screenshot
        await page.screenshot({
            path: outputPath,
            fullPage,
            type: 'png'
        });
    } catch (error) {
        throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
        if (page) {
            await page.close();
        }
    }
}

/**
 * Close browser instance (call this when done with all screenshots)
 */
export async function closeBrowser(): Promise<void> {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

