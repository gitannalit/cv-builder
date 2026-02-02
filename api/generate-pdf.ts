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

    browser = await puppeteer.launch({
      args: chromium.args || ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: executablePath || process.env.CHROMIUM_PATH || undefined,
      headless: chromium.headless ?? true,
      defaultViewport: chromium.defaultViewport || { width: 1200, height: 800 },
      ignoreHTTPSErrors: true,
    });

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
