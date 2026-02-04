import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { to, pdfBase64, filename = 'cv.pdf' } = req.body;

        if (!to || !pdfBase64) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { data, error } = await resend.emails.send({
            from: 'CV Builder <onboarding@resend.dev>',
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
            console.error('Resend error:', error);
            return res.status(400).json(error);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Email sending error:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
