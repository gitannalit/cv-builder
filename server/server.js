import express from 'express';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3000;

async function generatePdfBufferFromHtml(html) {
  const launchOptions = {
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: process.env.PUPPETEER_HEADLESS !== 'false',
    defaultViewport: { width: 1200, height: 800 },
    ignoreHTTPSErrors: true,
  };
  const execPath = process.env.CHROMIUM_PATH;
  if (execPath) launchOptions.executablePath = execPath;
  const browser = await puppeteer.launch(launchOptions);
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(300);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
    return pdfBuffer;
  } finally {
    try { await browser.close(); } catch (e) { /* ignore */ }
  }
}

app.post('/api/generate-pdf', async (req, res) => {
  const { html } = req.body || {};
  if (!html) return res.status(400).json({ error: 'Missing html in body' });
  try {
    const pdfBuffer = await generatePdfBufferFromHtml(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    return res.status(200).send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error('generate-pdf error:', err);
    return res.status(500).json({ error: 'PDF generation failed', details: String(err && err.message ? err.message : err) });
  }
});

app.post('/api/generate-and-upload-pdf', async (req, res) => {
  const { html, bucket = 'public', filename, expires = 3600 } = req.body || {};
  if (!html) return res.status(400).json({ error: 'Missing html in body' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceRole) {
    return res.status(500).json({ error: 'Missing Supabase configuration on server' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole, { auth: { persistSession: false } });

  try {
    const pdfBuffer = await generatePdfBufferFromHtml(html);

    const name = filename && typeof filename === 'string' ? filename.replace(/[^a-zA-Z0-9._-]/g, '') : null;
    const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}.pdf`;
    const path = name ? `${name.replace(/\.pdf$/, '')}-${unique}` : unique;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Upload failed', details: uploadError });
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(uploadData.path, expires);

    if (signedError) {
      console.error('Signed URL error:', signedError);
      return res.status(500).json({ error: 'Signed URL creation failed', details: signedError });
    }

    return res.status(200).json({ success: true, url: signedData.signedUrl, path: uploadData.path });
  } catch (err) {
    console.error('generate-and-upload-pdf error:', err);
    return res.status(500).json({ error: 'PDF generation/upload failed', details: String(err && err.message ? err.message : err) });
  }
});

app.get('/', (req, res) => res.send('cv-builder API running'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
