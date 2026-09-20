export async function sendEmail({ to, subject, text }) {
  // TODO: In production, integrate with SendGrid, Resend, or your preferred email service.
  // The console.log below is a development-only placeholder.
  console.log(`[MAIL] To: ${to}`);
  console.log(`[MAIL] Subject: ${subject}`);
  console.log(`[MAIL] Body:\n${text}`);
  console.log('[MAIL] --- (not actually sent; configure a production mailer)');
}

export function verificationEmailBody(token) {
  return `Welcome to NutriSync!

Please verify your email using this link (or copy the token below):

Verification link: /verify-email?token=${token}
Token: ${token}

This link expires in 24 hours.`;
}

export function resetEmailBody(token) {
  return `You requested a password reset.

Use this link (or copy the token below) to reset your password:

Reset link: /reset-password?token=${token}
Token: ${token}

This link expires in 1 hour.

If you did not request this, you can ignore this email.`;
}
