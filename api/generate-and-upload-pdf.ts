import type { VercelRequest, VercelResponse } from '@vercel/node';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const { html, bucket = 'public', filename, expires = 3600 } = req.body || {};
  if (!html) {
    res.status(400).json({ error: 'Missing html in body' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRole) {
    res.status(500).json({ error: 'Missing Supabase configuration on server' });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole, {
    auth: { persistSession: false },
  });

  let browser = null;
  try {
    // Use full puppeteer on a VPS. Allow overriding the executable via
    // the CHROMIUM_PATH env var if a system-installed Chrome/Chromium should be used.
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

    await page.waitForTimeout(300);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });

    // Prepare path
    const name = filename && typeof filename === 'string' ? filename.replace(/[^a-zA-Z0-9._-]/g, '') : null;
    const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}.pdf`;
    const path = name ? `${name.replace(/\.pdf$/, '')}-${unique}` : unique;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      res.status(500).json({ error: 'Upload failed', details: uploadError });
      return;
    }

    // Create signed URL
    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(uploadData.path, expires);

    if (signedError) {
      console.error('Signed URL error:', signedError);
      res.status(500).json({ error: 'Signed URL creation failed', details: signedError });
      return;
    }

    res.status(200).json({ success: true, url: signedData.signedUrl, path: uploadData.path });
  } catch (err: any) {
    console.error('PDF generation/upload error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'PDF generation/upload failed', details: String(err && err.message ? err.message : err) });
  } finally {
    try {
      if (browser) await browser.close();
    } catch (e) {
      // ignore
    }
  }
}
