import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
    console.log('API Request received:', req.method);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const apiKey = process.env.VITE_RESEND_API_KEY;
        if (!apiKey) {
            console.error('VITE_RESEND_API_KEY is not defined in environment variables');
            return res.status(500).json({
                error: 'Configuration error',
                message: 'La clave de API de Resend no está configurada en el servidor.'
            });
        }

        const resend = new Resend(apiKey);
        const { to, pdfBase64, filename = 'cv.pdf' } = req.body;

        if (!to || !pdfBase64) {
            return res.status(400).json({ error: 'Missing required fields', fields: { to: !!to, pdfBase64: !!pdfBase64 } });
        }

        console.log(`Attempting to send email to ${to} with attachment ${filename}`);

        const { data, error } = await resend.emails.send({
            from: process.env.VITE_RESEND_FROM_EMAIL || 'CV Builder <noreply@cv.training2work.com>',
            to: [to],
            subject: 'Tu CV generado',
            text: 'Adjunto encontrarás tu CV generado.',
            attachments: [
                {
                    filename: filename,
                    content: pdfBase64,
                },
            ],
        });

        if (error) {
            console.error('Resend API error:', error);
            return res.status(400).json({ error: 'Resend API error', details: error });
        }

        console.log('Email sent successfully:', data);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Unexpected error in send-email handler:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
        });
    }
}
