/**
 * Serverless / Express handler for UnicornTools contact form.
 * Works as a Vercel Serverless Function (/api/contact) and Express middleware.
 */

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export async function handleContactSubmission(payload: ContactPayload) {
  const { name, email, subject, message, honeypot } = payload;

  // Bot honeypot check
  if (honeypot && honeypot.trim().length > 0) {
    return {
      status: 200,
      body: { success: true, message: 'Message received.' },
    };
  }

  // Server-side validation
  if (!name || name.trim().length < 2) {
    return {
      status: 400,
      body: { success: false, error: 'Full name must be at least 2 characters.' },
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return {
      status: 400,
      body: { success: false, error: 'A valid email address is required.' },
    };
  }

  if (!subject || subject.trim().length === 0) {
    return {
      status: 400,
      body: { success: false, error: 'Subject is required.' },
    };
  }

  if (!message || message.trim().length < 10) {
    return {
      status: 400,
      body: { success: false, error: 'Message must be at least 10 characters long.' },
    };
  }

  const targetEmail = process.env.CONTACT_RECEIVER_EMAIL || 'digital.future1543@gmail.com';
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  // Option 1: Resend
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'UnicornTools Contact <onboarding@resend.dev>',
          to: [targetEmail],
          reply_to: email.trim(),
          subject: `[UnicornTools Contact] ${subject} from ${name.trim()}`,
          text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject.trim()}\n\nMessage:\n${message.trim()}\n\nSent from UnicornTools (https://unicorn-tools.vercel.app/)`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          status: 502,
          body: {
            success: false,
            error: `Email delivery provider rejected message: ${errText}`,
            supportEmail: targetEmail,
          },
        };
      }

      return {
        status: 200,
        body: {
          success: true,
          message: 'Thank you! Your message has been sent successfully. Our support team will review it shortly.',
        },
      };
    } catch (err: any) {
      return {
        status: 502,
        body: {
          success: false,
          error: `Failed to dispatch through Resend: ${err?.message || err}`,
          supportEmail: targetEmail,
        },
      };
    }
  }

  // Option 2: SendGrid
  if (sendgridApiKey) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sendgridApiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: targetEmail }] }],
          from: { email: 'support@unicorn-tools.vercel.app', name: 'UnicornTools Contact' },
          reply_to: { email: email.trim(), name: name.trim() },
          subject: `[UnicornTools Contact] ${subject} from ${name.trim()}`,
          content: [
            {
              type: 'text/plain',
              value: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject.trim()}\n\nMessage:\n${message.trim()}`,
            },
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          status: 502,
          body: {
            success: false,
            error: `SendGrid rejected dispatch: ${errText}`,
            supportEmail: targetEmail,
          },
        };
      }

      return {
        status: 200,
        body: {
          success: true,
          message: 'Thank you! Your message has been sent successfully.',
        },
      };
    } catch (err: any) {
      return {
        status: 502,
        body: {
          success: false,
          error: `Failed to dispatch through SendGrid: ${err?.message || err}`,
          supportEmail: targetEmail,
        },
      };
    }
  }

  // When no email provider credentials are configured:
  // Return an honest, clear response without pretending the message was sent.
  return {
    status: 503,
    body: {
      success: false,
      configured: false,
      error:
        'The server email delivery service is currently not configured with an active API key (RESEND_API_KEY or SENDGRID_API_KEY).',
      supportEmail: targetEmail,
    },
  };
}

// Vercel Serverless Function export default
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await handleContactSubmission(payload);
    return res.status(result.status).json(result.body);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error processing contact request',
    });
  }
}
