// resendClient.ts
// Cliente para enviar emails usando nuestra API serverless

export async function sendCVEmail(to: string, pdfBlob: Blob) {
  // Convertir el Blob a base64 para enviarlo a la API
  const reader = new FileReader();
  const pdfBase64Promise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(pdfBlob);
  });

  const pdfBase64 = await pdfBase64Promise;

  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      pdfBase64,
      filename: 'cv.pdf'
    })
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Error sending email:', errorData);
    const errorMessage = errorData.details
      ? `Error: ${errorData.error} - ${JSON.stringify(errorData.details)}`
      : errorData.error || errorData.message || 'Error enviando el email';
    throw new Error(errorMessage);
  }

  return res.json();
}
