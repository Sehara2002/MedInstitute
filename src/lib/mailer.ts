import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Website account emails. Course registration, payment and LMS access emails
// are sent by the LMS backend.

export async function sendWelcomeEmail(user: {
  name?: string | null;
  email: string;
}) {
  const info = await transporter.sendMail({
    from: `"MRCGP Fast Track" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: "Welcome to MRCGP Fast Track!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome${user.name ? `, ${user.name}` : ""}!</h2>
        <p>Thank you for creating a student account with MRCGP Fast Track.</p>
        <p>You now have access to your student dashboard, where you can:</p>
        <ul>
          <li>Browse all our MRCGP [INT] OSCE, AKT, and exam preparation courses</li>
          <li>Watch <strong>3 free preview videos</strong> for each course before enrolling</li>
          <li>Register and pay securely once you're ready to start</li>
        </ul>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://mrcgpfasttrack.com"}/dashboard"
             style="display: inline-block; background: #16a34a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Go to My Dashboard
          </a>
        </p>
        <p style="margin-top: 24px;">If you have any questions, just reply to this email — we're happy to help.</p>
        <p>Best regards,<br/>MRCGP Fast Track Team</p>
      </div>
    `,
  });

  console.log("[mailer] Welcome email sent to:", info.messageId);
  return info;
}