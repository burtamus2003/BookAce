import { Resend } from "resend";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "BookAce <bookace@inthometech.com>",
    to,
    subject: "Reset your BookAce password",
    html: `
      <p>Someone requested a password reset for this email address on BookAce.</p>
      <p><a href="${resetUrl}">Click here to set a new password</a>. This link expires in 1 hour.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });

  if (error) {
    throw new Error(`Resend failed to send password reset email: ${error.message}`);
  }
}

export async function sendLoanReminderEmail(
  to: string,
  bookTitle: string,
  borrowerName: string | null,
  lenderName: string | null,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const greeting = borrowerName ? `Hi ${borrowerName},` : "Hi,";
  const from = lenderName ? `${lenderName}` : "A friend";

  const { error } = await resend.emails.send({
    from: "BookAce <bookace@inthometech.com>",
    to,
    subject: `Reminder: "${bookTitle}" is due back`,
    html: `
      <p>${greeting}</p>
      <p>${from} loaned you "${bookTitle}" and wanted to check if you're able to return it soon.</p>
    `,
  });

  if (error) {
    throw new Error(`Resend failed to send loan reminder email: ${error.message}`);
  }
}
