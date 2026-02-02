import type { VercelRequest, VercelResponse } from '@vercel/node';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const { html } = req.body || {};
  if (!html) {
    res.status(400).json({ error: 'Missing html in body' });
    return;
  }

  let browser = null;
  try {
    const executablePath = await chromium.executablePath;
    console.log('chromium.executablePath:', executablePath);
    console.log('chromium.headless:', chromium.headless);
    console.log('chromium.args length:', Array.isArray(chromium.args) ? chromium.args.length : 0);

    // If chrome-aws-lambda doesn't provide an executable path (common on Vercel),
    // fall back to the full `puppeteer` package which bundles Chromium.
    let launcher: any = puppeteer;
    let launchOptions: any = {
      args: chromium.args || ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: chromium.headless ?? true,
      defaultViewport: chromium.defaultViewport || { width: 1200, height: 800 },
      ignoreHTTPSErrors: true,
    };

    if (executablePath) {
      // Use chrome-aws-lambda provided binary
      launchOptions.executablePath = executablePath;
      browser = await launcher.launch(launchOptions);
    } else {
      // Try to dynamically load full puppeteer (bundles Chromium)
      try {
        const full = await import('puppeteer');
        launcher = full;
        // prefer no-sandbox on serverless
        launchOptions.args = launchOptions.args.concat(['--no-sandbox', '--disable-setuid-sandbox']);
        browser = await launcher.launch(launchOptions);
      } catch (e) {
        // If full puppeteer isn't available, fallback to puppeteer-core and hope for the best
        console.warn('Full puppeteer not available, attempting puppeteer-core (may fail)');
        launchOptions.executablePath = process.env.CHROMIUM_PATH || undefined;
        browser = await launcher.launch(launchOptions);
      }
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait a bit for fonts/resources to load
    await page.waitForTimeout(300);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (err: any) {
    console.error('PDF generation error:', err && err.stack ? err.stack : err);
    // Return error message for easier debugging (can be removed in production)
    res.status(500).json({ error: 'PDF generation failed', details: String(err && err.message ? err.message : err) });
  } finally {
    try {
      if (browser) await browser.close();
    } catch (e) {
      // ignore
    }
  }
}
