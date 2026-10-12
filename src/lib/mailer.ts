import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendStudentWelcomeEmail({
  to,
  fullName,
  studentCode,
  initialPassword,
  courseName,
}: {
  to: string;
  fullName: string;
  studentCode: string;
  initialPassword: string;
  courseName?: string;
}) {
  const lmsUrl = process.env.NEXT_PUBLIC_LMS_FRONTEND_URL || "http://localhost:3000";
  const queryParams = new URLSearchParams();
  if (to) queryParams.set("email", to);
  if (initialPassword) queryParams.set("initial", initialPassword);
  const queryString = queryParams.toString();
  const loginUrl = `${lmsUrl}/login${queryString ? `?${queryString}` : ""}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MRCGP LMS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6fcf9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f6fcf9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 18px; border: 1px solid #e2ece7; box-shadow: 0 10px 25px -5px rgba(0, 108, 73, 0.08); overflow: hidden;" cellspacing="0" cellpadding="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #006c49 0%, #084c37 100%); padding: 32px 30px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">MRCGP LMS</h1>
                    <p style="color: #d1fae5; font-size: 13px; margin: 6px 0 0 0; font-weight: 500;">Postgraduate Training & Assessment Portal</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 600; margin: 0 0 14px 0;">Welcome, ${fullName}!</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                Your student account has been successfully created. You can now access your enrolled courses, clinical modules, mock exams, and resources.
              </p>

              <!-- Credentials Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; margin-bottom: 26px;">
                <tr>
                  <td style="padding: 20px 22px;">
                    <div style="font-size: 12px; font-weight: 700; color: #006c49; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 14px;">
                      Your Sign-In Credentials
                    </div>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 130px; font-weight: 500;">Email:</td>
                        <td style="padding: 6px 0; color: #0f172a; font-size: 14px; font-weight: 600; font-family: monospace;">${to}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 500;">Temporary Password:</td>
                        <td style="padding: 6px 0; color: #006c49; font-size: 15px; font-weight: 700; font-family: monospace; background: #ffffff; padding: 4px 8px; border-radius: 6px; border: 1px dashed #86efac; display: inline-block;">${initialPassword}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 500;">Student ID:</td>
                        <td style="padding: 6px 0; color: #334155; font-size: 13px; font-weight: 600;">${studentCode}</td>
                      </tr>
                      ${
                        courseName
                          ? `<tr>
                        <td style="padding: 6px 0; color: #64748b; font-size: 13px; font-weight: 500;">Enrolled Course:</td>
                        <td style="padding: 6px 0; color: #334155; font-size: 13px; font-weight: 600;">${courseName}</td>
                      </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" target="_blank" style="display: inline-block; background-color: #006c49; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 34px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 108, 73, 0.28); transition: background-color 0.2s ease;">
                      Sign In to Student Portal
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Instructions / Security Notice -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-left: 3px solid #006c49; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #475569; font-size: 12px; line-height: 1.5;">
                      <strong>First-Time Sign-In:</strong> When you click the sign-in button above, you will be prompted to set your own permanent private password before accessing your student dashboard.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
                If you need assistance logging in, please contact your course administrator.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafbfc; border-top: 1px solid #e2ece7; padding: 20px 32px; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.4;">
                &copy; ${new Date().getFullYear()} MRCGP LMS Platform. All rights reserved.<br>
                This email was sent to ${to} for LMS account registration.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const info = await transporter.sendMail({
    from: `"MRCGP LMS" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Welcome to MRCGP LMS - Your Student Portal Access Details",
    html: htmlContent,
  });

  console.log("[mailer] Student credentials welcome email sent to payee:", info.messageId);
  return info;
}

export async function sendPayLaterEmail({
  to,
  fullName,
  courseName,
  amount,
  registrationId,
  payUrl,
}: {
  to: string;
  fullName: string;
  courseName: string;
  amount: number;
  registrationId: string;
  payUrl?: string;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.WEBSITE_URL ||
    "http://localhost:3001";
  const finalPayUrl = payUrl || `${siteUrl}/register/summary?id=${registrationId}`;

  const formattedAmount =
    typeof amount === "number"
      ? amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : `${amount}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course Registration Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); overflow: hidden;" cellspacing="0" cellpadding="0">
          
          <!-- Forest Green Header Banner -->
          <tr>
            <td style="background-color: #055838; padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">MRCGP Fast Track</h1>
              <p style="color: #d1fae5; font-size: 13px; font-weight: 600; margin: 6px 0 0 0;">Course Registration Received</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="font-size: 17px; font-weight: 700; color: #1e293b; margin: 0 0 14px 0;">Dear ${fullName},</h2>
              
              <p style="font-size: 13.5px; line-height: 1.6; color: #475569; margin: 0 0 22px 0;">
                Your registration for <strong style="color: #0f172a;">${courseName}</strong> was successful. Seats are limited and are given in the order payments are received, so please complete your payment to secure your slot.
              </p>

              <!-- Registration Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px; padding: 18px 20px; margin-bottom: 26px;">
                <tr>
                  <td>
                    <p style="font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 12px 0;">YOUR REGISTRATION</p>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 5px 0; font-size: 13px; color: #64748b; width: 110px;">Course</td>
                        <td style="padding: 5px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${courseName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 13px; color: #64748b;">Amount due</td>
                        <td style="padding: 5px 0; font-size: 14px; font-weight: 800; color: #0f172a;">LKR ${formattedAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 13px; color: #64748b;">Reference</td>
                        <td style="padding: 5px 0; font-size: 11.5px; font-family: 'SFMono-Regular', Consolas, Menlo, monospace; color: #334155; font-weight: 600;">${registrationId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Centered Pay Now CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${finalPayUrl}" style="display: inline-block; background-color: #055838; color: #ffffff; font-size: 15px; font-weight: 700; padding: 13px 44px; border-radius: 8px; text-decoration: none; box-shadow: 0 3px 8px rgba(5, 88, 56, 0.25);">Pay Now</a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; line-height: 1.55; color: #64748b; margin: 0; text-align: left;">
                Once your payment is confirmed you will receive a second email with your LMS login credentials. If you have already paid, please ignore this message.
              </p>
            </td>
          </tr>

          <!-- Light Gray Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #edf2f7; padding: 16px 20px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                This is an automated message. Reply to this email if you have any questions.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const info = await transporter.sendMail({
    from: `"MRCGP Fast Track" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Registration Received — ${courseName} (MRCGP Fast Track)`,
    html: htmlContent,
  });

  console.log("[mailer] Pay Later / Registration email sent:", info.messageId, "to:", to);
  return info;
}

// Deprecated: kept as empty stub to prevent any older code from sending the unwanted receipt email
export async function sendRegistrationConfirmation(_registration?: unknown) {
  return null;
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