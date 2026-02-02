// resendClient.ts
// Cliente para enviar emails usando la API de Resend

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export async function sendCVEmail(to: string, pdfBlob: Blob) {
  if (!RESEND_API_KEY) throw new Error('Falta la clave de API de Resend');
  const formData = new FormData();
  formData.append('to', to);
  formData.append('from', 'cv-builder@tudominio.com');
  formData.append('subject', 'Tu CV generado');
  formData.append('text', 'Adjunto encontrarás tu CV generado.');
  formData.append('attachments', new File([pdfBlob], 'cv.pdf', { type: 'application/pdf' }));

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
