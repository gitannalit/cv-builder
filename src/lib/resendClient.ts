// resendClient.ts
// Cliente para enviar emails usando la API de Resend

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export async function sendCVEmail(to: string, pdfBlob?: Blob | null, attachmentUrl?: string) {
  if (!RESEND_API_KEY) throw new Error('Falta la clave de API de Resend');
  const formData = new FormData();
  formData.append('to', to);
  formData.append('from', 'cv-builder@tudominio.com');
  formData.append('subject', 'Tu CV generado');

  // If we have a signed URL, include it in the email body (HTML + text)
  if (attachmentUrl) {
    formData.append('text', `Tu CV está disponible aquí: ${attachmentUrl}`);
    formData.append('html', `<p>Hola,<br/>Tu CV está disponible <a href="${attachmentUrl}">aquí</a>. El enlace caduca pronto.</p>`);
  } else {
    formData.append('text', 'Adjunto encontrarás tu CV generado.');
  }

  // If a blob is provided, attach it as a file
  if (pdfBlob) {
    formData.append('attachments', new File([pdfBlob], 'cv.pdf', { type: 'application/pdf' }));
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: formData
  });
  if (!res.ok) throw new Error('Error enviando el email');
  return res.json();
}
