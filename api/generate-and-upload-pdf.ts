import type { VercelRequest, VercelResponse } from '@vercel/node';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
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
