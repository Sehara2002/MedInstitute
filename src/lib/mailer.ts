import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendRegistrationConfirmation(registration: {
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  amount: number;
  id: string;
  orderId?: string | null;
}) {
  const info = await transporter.sendMail({
    from: `"MRCGP Fast Track" <${process.env.GMAIL_USER}>`,
    to: registration.email,
    subject: "Registration Confirmed — Payment Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Registration Confirmed</h2>
        <p>Dear ${registration.firstName} ${registration.lastName},</p>
        <p>We've received your payment and your registration is confirmed.</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:8px; border:1px solid #eee;"><strong>Registration ID</strong></td><td style="padding:8px; border:1px solid #eee;">${registration.id}</td></tr>
          <tr><td style="padding:8px; border:1px solid #eee;"><strong>Course</strong></td><td style="padding:8px; border:1px solid #eee;">${registration.course}</td></tr>
          <tr><td style="padding:8px; border:1px solid #eee;"><strong>Amount Paid</strong></td><td style="padding:8px; border:1px solid #eee;">LKR ${registration.amount.toLocaleString()}</td></tr>
          ${registration.orderId ? `<tr><td style="padding:8px; border:1px solid #eee;"><strong>Order Reference</strong></td><td style="padding:8px; border:1px solid #eee;">${registration.orderId}</td></tr>` : ""}
        </table>
        <p>Please keep this email for your records.</p>
        <p>Thank you,<br/>MRCGP Fast Track</p>
      </div>
    `,
  });

  console.log("[mailer] Confirmation sent to payee:", info.messageId);
  return info;
}

export async function sendPaymentNotification(registration: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course: string;
  amount: number;
  id: string;
  orderId?: string | null;
}) {
  const info = await transporter.sendMail({
    from: `"New Payment Notification" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // sending to yourself
    subject: `Payment Received — ${registration.firstName} ${registration.lastName} (LKR ${registration.amount.toLocaleString()})`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>New Payment Received</h3>
        <ul>
          <li><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</li>
          <li><strong>Email:</strong> ${registration.email}</li>
          <li><strong>Phone:</strong> ${registration.phone}</li>
          <li><strong>Course:</strong> ${registration.course}</li>
          <li><strong>Amount:</strong> LKR ${registration.amount.toLocaleString()}</li>
          <li><strong>Registration ID:</strong> ${registration.id}</li>
          <li><strong>Order Reference:</strong> ${registration.orderId || "N/A"}</li>
        </ul>
      </div>
    `,
  });

  console.log("[mailer] Payment notification sent to admin:", info.messageId);
  return info;
}