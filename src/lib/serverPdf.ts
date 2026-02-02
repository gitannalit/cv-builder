export async function generatePdfOnServer(html: string): Promise<Blob> {
  const res = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server PDF generation failed: ${res.status} ${text}`);
  }
  return await res.blob();
}

export async function generateAndUploadPdf(html: string, filename?: string, bucket: string = 'public', expires: number = 3600) {
  const res = await fetch('/api/generate-and-upload-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, filename, bucket, expires }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server PDF upload failed: ${res.status} ${text}`);
  }
  return await res.json(); // { success: true, url, path }
}
