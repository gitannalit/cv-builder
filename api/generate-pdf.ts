import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// Disable headless mode check for Vercel
chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

export const config = {
    maxDuration: 60, // 60 seconds for Pro plan
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let browser = null;

    try {
        const { html, filename = 'cv.pdf' } = req.body;

        if (!html) {
            return res.status(400).json({ error: 'HTML content is required' });
        }

        // Get the executable path for the current environment
        const executablePath = await chromium.executablePath();

        console.log('Chromium path:', executablePath);

        // Launch browser with @sparticuz/chromium for Vercel
        browser = await puppeteer.launch({
            args: [
                ...chromium.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--single-process',
            ],
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        // Set content and wait for fonts/images to load
        await page.setContent(html, {
            waitUntil: ['networkidle0', 'load'],
            timeout: 30000,
        });

        // Generate PDF with high quality settings
        const pdf = await page.pdf({
            format: 'a4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });

        await browser.close();
        browser = null;

        // Return PDF as buffer
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        res.setHeader('Content-Length', pdf.length);

        return res.status(200).send(pdf);
    } catch (error) {
        console.error('PDF generation error:', error);

        if (browser) {
            try {
                await browser.close();
            } catch (e) {
                console.error('Error closing browser:', e);
            }
        }

        return res.status(500).json({
            error: 'Failed to generate PDF',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
