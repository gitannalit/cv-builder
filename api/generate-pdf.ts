import type { VercelRequest, VercelResponse } from '@vercel/node';
// On VPS we use the full puppeteer package (bundles Chromium). Keep compatibility
// with chrome-aws-lambda removed for VPS usage.
import puppeteer from 'puppeteer';

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
    // For a VPS environment we expect puppeteer to be installed and Chromium
    // to be available via the bundled package. Use sensible defaults and allow
    // overriding executable via CHROMIUM_PATH env var if needed.
    const launchOptions: any = {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      headless: process.env.PUPPETEER_HEADLESS !== 'false',
      defaultViewport: { width: 1200, height: 800 },
      ignoreHTTPSErrors: true,
    };

    const execPath = process.env.CHROMIUM_PATH;
    if (execPath) launchOptions.executablePath = execPath;
    browser = await puppeteer.launch(launchOptions);

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
