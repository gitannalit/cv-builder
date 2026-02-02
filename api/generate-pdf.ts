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
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath || undefined,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport || { width: 1200, height: 800 },
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  } finally {
    try {
      if (browser) await browser.close();
    } catch (e) {
      // ignore
    }
  }
}
