import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
    maxDuration: 30, // Maximum for Vercel Pro, 10 for free tier
};

export default async function handler(
    req: any,
    res: any
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { html, filename = 'cv.pdf' } = req.body;

        if (!html) {
            return res.status(400).json({ error: 'HTML content is required' });
        }

        // Launch browser with chrome-aws-lambda configuration
        const browser = await puppeteer.launch({
            args: chrome.args,
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });

        const page = await browser.newPage();

        // Set content and wait for fonts/images to load
        await page.setContent(html, {
            waitUntil: ['networkidle0', 'load'],
        });

        // Generate PDF with high quality settings
        const pdf = await page.pdf({
            format: 'a4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        });

        await browser.close();

        // Return PDF as buffer
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(filename)}"`
        );
        res.setHeader('Content-Length', pdf.length);

        return res.status(200).send(pdf);
    } catch (error) {
        console.error('PDF generation error:', error);
        return res.status(500).json({
            error: 'Failed to generate PDF',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
