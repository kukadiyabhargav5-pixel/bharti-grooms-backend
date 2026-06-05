const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP (Configuration via Env)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  pool: true,
  auth: {
    user: process.env.EMAIL_USER || 'bhartiglooms@gmail.com',
    pass: process.env.EMAIL_PASS || 'rfkoehhqsicppagn'
  }
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bhartiglooms.in';
const COMPANY_EMAIL = process.env.EMAIL_USER || 'bhartiglooms@gmail.com';

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Nodemailer Verification Error:', error);
  } else {
    console.log('✅ Nodemailer is ready to send emails');
  }
});

// ─── Welcome Email (Professional Business Redesign) ─────────────────────────
const sendWelcomeEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: `"Bharti Glooms" <${COMPANY_EMAIL}>`,
    to: toEmail,
    subject: '🌸 Welcome to Bharti Glooms – A New Era of Premium Ethnic Wear!',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background-color:#ffffff;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#333333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdfaf9;padding:50px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #eeeeee;border-radius:4px;overflow:hidden;">
                
                <!-- Brand Header -->
                <tr>
                  <td style="background-color:#600018;padding:45px 30px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:300;letter-spacing:6px;text-transform:uppercase;">Bharti Glooms</h1>
                    <div style="width:50px;height:2px;background-color:#c5a022;margin:15px auto 0;"></div>
                    <p style="color:#e5e5e5;margin:10px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Exquisite Heritage. Modern Grace.</p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding:50px 40px;">
                    <h2 style="color:#600018;font-size:22px;margin:0 0 20px;font-weight:400;text-align:center;">Namaste, ${userName}!</h2>
                    <p style="font-size:15px;line-height:26px;color:#555555;margin:0 0 20px;text-align:justify;">
                      It is our distinct pleasure to welcome you to the Bharti Glooms inner circle. Here, we don't just sell attire; we celebrate the timeless artistry of Indian heritage. Every thread used in our collection tells a story of craftsmanship, culture, and care.
                    </p>
                    <p style="font-size:15px;line-height:26px;color:#555555;margin:0 0 35px;text-align:justify;">
                      As a valued member, you now have first-access to our newest handloomed arrivals, limited edition collections, and exclusive member-only showcases.
                    </p>

                    <!-- CTA Section -->
                    <div style="text-align:center;margin-bottom:40px;">
                      <a href="${FRONTEND_URL}" style="background-color:#600018;color:#ffffff;padding:15px 40px;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;border-radius:2px;display:inline-block;">EXPLORE OUR COLLECTIONS</a>
                    </div>

                    <!-- Company Story Section -->
                    <div style="background-color:#f9f9f9;padding:30px;border-left:4px solid #c5a022;margin-bottom:40px;">
                      <h3 style="color:#600018;font-size:16px;margin:0 0 10px;text-transform:uppercase;letter-spacing:1px;">The Bharti Glooms Promise</h3>
                      <p style="font-size:13px;line-height:22px;color:#666666;margin:0;">
                        We believe in slow fashion. Our sarees and ethnic ensembles are sourced directly from master weavers, ensuring that the essence of traditional techniques remains intact while providing you with unparalleled quality and authenticity.
                      </p>
                    </div>

                    <!-- Value Columns -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="padding:10px 10px 10px 0;vertical-align:top;">
                          <h4 style="color:#600018;font-size:14px;margin:0 0 8px;">Authentic Craftsmanship</h4>
                          <p style="font-size:12px;line-height:18px;color:#888888;margin:0;">Every piece is verified for purity and hand-worked detailing.</p>
                        </td>
                        <td width="50%" style="padding:10px 0 10px 10px;vertical-align:top;">
                          <h4 style="color:#600018;font-size:14px;margin:0 0 8px;">Dedicated Concierge</h4>
                          <p style="font-size:12px;line-height:18px;color:#888888;margin:0;">Our experts are always here to help you find the perfect silhouette.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#fdfaf9;padding:35px 40px;text-align:center;border-top:1px solid #eeeeee;">
                    <p style="color:#999999;font-size:12px;margin:0 0 15px;">You're receiving this email because you've joined the Bharti Glooms family.</p>
                    <p style="color:#600018;font-size:12px;font-weight:bold;margin:0;">
                      <a href="mailto:${COMPANY_EMAIL}" style="color:#600018;text-decoration:none;">Support</a> &nbsp;|&nbsp; 
                      <a href="${FRONTEND_URL}/our-story" style="color:#600018;text-decoration:none;">Our Story</a> &nbsp;|&nbsp; 
                      <a href="${FRONTEND_URL}/privacy" style="color:#600018;text-decoration:none;">Privacy</a>
                    </p>
                    <p style="color:#bbbbbb;font-size:11px;margin:20px 0 0;">© 2026 Bharti Glooms. Designed for Elegance.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions)
    .then(() => console.log(`✅ Welcome email sent to ${toEmail}`))
    .catch((error) => console.error(`❌ Failed to send welcome email:`, error.message));
};

// ─── Order Confirmation Email (Professional Business Redesign) ───────────────────
const sendOrderConfirmationEmail = async (toEmail, customerName, order) => {
  const itemsHtml = order.products.map(item => `
    <tr>
      <td style="padding:15px 0;border-bottom:1px solid #f2f2f2;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="70" style="vertical-align:top;">
              ${item.photo ? `<img src="${item.photo}" style="width:60px;height:70px;object-fit:cover;border:1px solid #eeeeee;border-radius:2px;">` : ''}
            </td>
            <td style="padding-left:15px;vertical-align:top;">
              <p style="margin:0;font-size:14px;color:#333333;font-weight:600;">${item.name}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#888888;">Quantity: ${item.quantity}</p>
            </td>
            <td style="text-align:right;vertical-align:top;">
              <p style="margin:0;font-size:14px;color:#600018;font-weight:bold;">₹${(item.price * item.quantity).toLocaleString()}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const orderDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const orderId = order._id?.toString().slice(-8).toUpperCase() || 'N/A';

  const mailOptions = {
    from: `"Bharti Glooms" <${COMPANY_EMAIL}>`,
    to: toEmail,
    subject: `Order Recieved: Success! (ID: #${orderId})`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background-color:#ffffff;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;color:#333333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #eeeeee;border-radius:2px;overflow:hidden;">
                
                <!-- Brand Header -->
                <tr>
                  <td style="background-color:#600018;padding:35px 30px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:300;letter-spacing:4px;text-transform:uppercase;">Order Recieved</h1>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding:40px 40px 20px;">
                    <p style="font-size:16px;color:#333333;margin:0 0 10px;">Dear <strong>${customerName}</strong>,</p>
                    <p style="font-size:14px;line-height:24px;color:#666666;margin:0;">
                      Thank you for choosing Bharti Glooms. We are delighted to confirm that your order has been received and is currently being processed by our dedicated fulfilment team.
                    </p>
                  </td>
                </tr>

                <!-- Summary Grid -->
                <tr>
                  <td style="padding:0 40px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #600018;border-bottom:1px solid #eeeeee;padding:15px 0;">
                      <tr>
                        <td width="50%">
                          <p style="margin:0;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:1px;">Reference Number</p>
                          <p style="margin:4px 0 0;font-size:16px;color:#600018;font-weight:bold;">#${orderId}</p>
                        </td>
                        <td width="50%" style="text-align:right;">
                          <p style="margin:0;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:1px;">Date of Order</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#333333;font-weight:600;">${orderDate}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Items Section -->
                <tr>
                  <td style="padding:0 40px 30px;">
                    <h3 style="font-size:13px;color:#600018;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">Shipment Summary</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${itemsHtml}
                    </table>
                    
                    <!-- Payment Details Table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px; border-top: 1px solid #f2f2f2; padding-top: 15px;">
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:1px;">Payment Method</span>
                        </td>
                        <td style="padding: 5px 0; text-align: right;">
                          <span style="font-size:13px;color:#333333;font-weight:600;">${order.payment?.method || 'N/A'}</span>
                        </td>
                      </tr>
                      ${order.payment?.transactionId ? `
                      <tr>
                        <td style="padding: 5px 0;">
                          <span style="font-size:12px;color:#999999;text-transform:uppercase;letter-spacing:1px;">Transaction ID</span>
                        </td>
                        <td style="padding: 5px 0; text-align: right;">
                          <span style="font-size:13px;color:#333333;font-weight:600;">#${order.payment.transactionId}</span>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 15px 0; border-top: 1px solid #f2f2f2; margin-top: 10px;">
                          <span style="font-size:13px;color:#999999;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Grand Total</span>
                        </td>
                        <td style="padding: 15px 0; text-align: right; border-top: 1px solid #f2f2f2;">
                          <span style="font-size:20px;color:#600018;font-weight:bold;">₹${order.totalAmount?.toLocaleString()}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Logistics Timeline -->
                <tr>
                  <td style="padding:0 40px 40px;">
                    <div style="background-color:#fdf4f6;padding:25px;border-radius:4px;">
                      <h3 style="font-size:13px;color:#600018;margin:0 0 15px;text-transform:uppercase;letter-spacing:1px;">Next Steps In Your Logistics</h3>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="30" style="vertical-align:top;padding-bottom:15px;">
                            <div style="width:14px;height:14px;background-color:#600018;border-radius:50%;"></div>
                            <div style="width:2px;height:30px;background-color:#dddddd;margin-left:6px;"></div>
                          </td>
                          <td style="padding-bottom:15px;padding-left:10px;">
                            <p style="margin:0;font-size:13px;color:#333333;font-weight:bold;">Order Preparation</p>
                            <p style="margin:2px 0 0;font-size:11px;color:#888888;">Our experts are hand-checking your items for quality assurance.</p>
                          </td>
                        </tr>
                        <tr>
                          <td width="30" style="vertical-align:top;padding-bottom:15px;">
                            <div style="width:14px;height:14px;background-color:#dddddd;border-radius:50%;"></div>
                            <div style="width:2px;height:30px;background-color:#dddddd;margin-left:6px;"></div>
                          </td>
                          <td style="padding-bottom:15px;padding-left:10px;">
                            <p style="margin:0;font-size:13px;color:#888888;">Dispatch Confirmation</p>
                            <p style="margin:2px 0 0;font-size:11px;color:#bbbbbb;">You will receive a tracking link via email within 24-48 hours.</p>
                          </td>
                        </tr>
                        <tr>
                          <td width="30" style="vertical-align:top;">
                            <div style="width:14px;height:14px;background-color:#dddddd;border-radius:50%;"></div>
                          </td>
                          <td style="padding-left:10px;">
                            <p style="margin:0;font-size:13px;color:#888888;">Concierge Delivery</p>
                            <p style="margin:2px 0 0;font-size:11px;color:#bbbbbb;">A doorstep delivery tailored to your convenience.</p>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>

                <!-- Destination Details -->
                <tr>
                  <td style="padding:0 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="vertical-align:top;padding-right:20px;">
                          <h4 style="font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Shipping Destination</h4>
                          <p style="font-size:12px;line-height:18px;color:#555555;margin:0;">
                            <strong>${order.customer?.name || customerName}</strong><br>
                            ${order.customer?.address || 'N/A'}<br>
                            T: ${order.customer?.mobile || 'N/A'}
                          </p>
                        </td>
                        <td width="50%" style="vertical-align:top;">
                          <h4 style="font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Customer Support</h4>
                          <p style="font-size:12px;line-height:18px;color:#555555;margin:0;">
                            Email: ${COMPANY_EMAIL}<br>
                            Working Hours: 10AM - 7PM IST
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f9f9f9;padding:30px 40px;text-align:center;border-top:1px solid #eeeeee;">
                    <p style="color:#bbbbbb;font-size:11px;margin:0 0 10px;line-height:18px;">
                      Thank you for trusting Bharti Glooms with your premium ethnic wear needs. We look forward to serving you again.
                    </p>
                    <p style="color:#600018;font-size:12px;font-weight:bold;margin:0;letter-spacing:1px;text-transform:uppercase;">
                      BHARTI GLOOMS — Designed for Elegance
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions)
    .then(() => console.log(`✅ Order confirmation email sent to ${toEmail}`))
    .catch((error) => console.error(`❌ Failed to send order confirmation:`, error.message));
};

// ─── OTP Email ────────────────────────────────────────────────────────────
const sendOtpEmail = async (toEmail, userName, otp) => {
  const mailOptions = {
    from: `"Bharti Glooms" <${COMPANY_EMAIL}>`,
    to: toEmail,
    subject: '🔐 Your OTP for Password Reset – Bharti Glooms',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f8f5f2;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr><td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#800020,#a0002a);padding:30px;text-align:center;">
                  <h1 style="color:white;margin:0;font-size:1.6rem;font-weight:800;">BHARTI GLOOMS</h1>
                  <p style="color:rgba(255,255,255,0.8);margin:5px 0 0;font-size:0.85rem;">Password Reset</p>
                </td>
              </tr>
              <tr>
                <td style="padding:35px 40px;text-align:center;">
                  <div style="font-size:2.5rem;margin-bottom:10px;">🔐</div>
                  <h2 style="color:#800020;margin:0 0 8px;">Hello, ${userName}!</h2>
                  <p style="color:#555;margin:0 0 25px;line-height:1.6;">Your OTP code for resetting your password is:</p>
                  <div style="background:linear-gradient(135deg,#800020,#a0002a);color:white;font-size:2.5rem;font-weight:900;letter-spacing:10px;padding:20px 30px;border-radius:16px;display:inline-block;margin-bottom:20px;">
                    ${otp}
                  </div>
                  <p style="color:#888;font-size:0.85rem;margin:0;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
                </td>
              </tr>
              <tr>
                <td style="background:#fdf8f8;padding:20px 40px;text-align:center;border-top:1px solid #f0e8e8;">
                  <p style="color:#999;font-size:0.8rem;margin:0;">If you did not request this, please ignore this email.<br>© 2026 Bharti Glooms</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  };
  transporter.sendMail(mailOptions)
    .then(() => console.log(`✅ OTP email sent to ${toEmail}`))
    .catch((error) => {
      console.error(`❌ Failed to send OTP to ${toEmail}:`, error.message);
    });
};

// ─── Complaint Notification Email (To Admin) ──────────────────────────────
const sendComplaintNotification = async (name, email, subject, message) => {
  const mailOptions = {
    from: `"Bharti Glooms Support" <${COMPANY_EMAIL}>`,
    to: COMPANY_EMAIL,
    subject: `🚨 New Inquiry: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
              <tr>
                <td style="background:#600018;padding:20px;text-align:center;color:white;">
                  <h2 style="margin:0;">New Customer Inquiry</h2>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;">
                  <p><strong>From:</strong> ${name} (${email})</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
                  <p style="white-space:pre-wrap;">${message}</p>
                  <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
                  <p style="font-size:12px;color:#888;">This is an automated notification from the Bharti Glooms contact form.</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `
  };
  transporter.sendMail(mailOptions)
    .then(() => console.log(`✅ Complaint notification sent to admin`))
    .catch((error) => console.error(`❌ Failed to send complaint notification:`, error.message));
};

// Function to send a reply to a customer inquiry
const sendReplyEmail = async (to, originalSubject, replyMessage, originalMessage) => {
  const mailOptions = {
    from: `"Bharti Glooms Support" <${process.env.EMAIL_USER || 'bhartiglooms@gmail.com'}>`,
    to: to,
    subject: `Official Response: ${originalSubject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background-color:#fdfaf9;font-family:'Garamond', 'Georgia', serif;color:#333333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fdfaf9;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #d4af37;box-shadow:0 15px 35px rgba(96,0,24,0.1);overflow:hidden;border-radius:2px;">
                
                <!-- Luxury Header -->
                <tr>
                  <td style="background-color:#600018;padding:40px;text-align:center;">
                    <h1 style="color:#d4af37;margin:0;font-size:28px;font-weight:300;letter-spacing:6px;text-transform:uppercase;">Bharti Glooms</h1>
                    <div style="width:40px;height:1px;background-color:#d4af37;margin:15px auto;"></div>
                    <p style="color:#ffffff;margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;opacity:0.8;">Concierge Support Team</p>
                  </td>
                </tr>

                <!-- Greeting & Message -->
                <tr>
                  <td style="padding:50px 45px;">
                    <h2 style="color:#600018;font-size:20px;margin:0 0 25px;font-weight:400;">Warm Greetings,</h2>
                    
                    <p style="font-size:16px;line-height:28px;color:#4a5568;margin-bottom:30px;font-style:italic;background:rgba(212,175,55,0.05);padding:25px;border-left:3px solid #d4af37;border-radius:0 4px 4px 0;">
                      "${replyMessage}"
                    </p>

                    <p style="font-size:15px;line-height:24px;color:#555555;margin-bottom:40px;">
                      We hope this information helps. At Bharti Glooms, we are committed to ensuring your experience with our ethnic collections is nothing short of exceptional.
                    </p>

                    <div style="border-top:1px solid #f1f5f9;padding-top:25px;margin-top:20px;">
                      <p style="margin:0;font-size:14px;color:#600018;font-weight:bold;">Kind Regards,</p>
                      <p style="margin:4px 0 0;font-size:14px;color:#333333;">Bharti Glooms Support Console</p>
                    </div>
                  </td>
                </tr>

                <!-- Original Message Context -->
                <tr>
                  <td style="background-color:#f9f9f9;padding:30px 45px;border-top:1px solid #eeeeee;">
                    <h4 style="color:#999999;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">Inquiry Reference</h4>
                    <p style="font-size:13px;color:#666666;margin:0;"><strong>Subject:</strong> ${originalSubject}</p>
                    <p style="font-size:12px;color:#888888;margin:5px 0 0;line-height:1.5;"><strong>Your Message:</strong> ${originalMessage}</p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#ffffff;padding:30px;text-align:center;border-top:1px solid #f1f5f9;">
                    <p style="color:#bbbbbb;font-size:10px;margin:0;">© 2026 Bharti Glooms. Handcrafted Elegance.</p>
                    <p style="color:#600018;font-size:10px;margin:10px 0 0;font-weight:bold;">
                      <a href="https://bhartiglooms.in" style="color:#600018;text-decoration:none;">Visit Boutique</a> &nbsp; | &nbsp; 
                      <a href="mailto:bhartiglooms@gmail.com" style="color:#600018;text-decoration:none;">Global Support</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions)
    .then(() => console.log(`✅ Reply email sent successfully to ${to}`))
    .catch((error) => {
      console.error('❌ Error sending reply email:', error);
    });
};

// ─── Order Tracking Dispatch Email ──────────────────────────────────────────
const sendTrackingEmail = async (toEmail, customerName, orderId, trackingId) => {
  const shortOrderId = orderId?.toString().slice(-8).toUpperCase() || 'N/A';
  const mailOptions = {
    from: `"Bharti Glooms" <${COMPANY_EMAIL}>`,
    to: toEmail,
    subject: `🚚 Shipment Dispatched: Order #${shortOrderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background-color:#f9f9f9;font-family:'Segoe UI', Arial, sans-serif;color:#333333;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                <tr>
                  <td style="background-color:#600018;padding:35px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:3px;text-transform:uppercase;">Package Dispatched</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <p style="font-size:16px;color:#333333;margin:0 0 15px;">Dear <strong>${customerName}</strong>,</p>
                    <p style="font-size:14px;line-height:24px;color:#555555;margin:0 0 30px;">
                      Great news! Your recent order from Bharti Glooms has been packed, handed over to our logistics partner, and is now officially on its way to your destination.
                    </p>
                    
                    <div style="background-color:#f8f5f2;border:1px solid #e2d5c8;border-radius:4px;padding:25px;text-align:center;margin-bottom:30px;">
                      <p style="color:#888888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Your Tracking/AWB ID</p>
                      <h2 style="color:#600018;font-size:26px;letter-spacing:4px;margin:0;">${trackingId}</h2>
                    </div>

                    <p style="font-size:13px;line-height:22px;color:#666666;margin:0 0 20px;">
                      You can use this tracking ID on our logistics partner's website to track the live movement of your package. Please allow up to 24 hours for tracking data to sync globally.
                    </p>

                    <hr style="border:none;border-top:1px solid #eeeeee;margin:30px 0;">
                    
                    <p style="margin:0;font-size:14px;color:#333333;font-weight:bold;">Bharti Glooms Support</p>
                    <p style="margin:5px 0 0;font-size:12px;color:#888888;">If you face any issues, feel free to respond to this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions)
    .then(() => console.log(`✅ Tracking email sent to ${toEmail}`))
    .catch((error) => console.error(`❌ Failed to send tracking email:`, error.message));
};

module.exports = { 
  sendWelcomeEmail, 
  sendOrderConfirmationEmail, 
  sendOtpEmail, 
  sendComplaintNotification,
  sendReplyEmail,
  sendTrackingEmail
};
