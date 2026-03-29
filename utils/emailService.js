const nodemailer = require('nodemailer');

// Create reusable transporter using Gmail SMTP (Configuration via Env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'bhartiglooms@gmail.com',
    pass: process.env.EMAIL_PASS || 'rfko ehhq sicp pagn'
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
    from: `"Bharti Glooms 🌸" <${COMPANY_EMAIL}>`,
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

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email:`, error.message);
  }
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
    from: `"Bharti Glooms 🌸" <${COMPANY_EMAIL}>`,
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
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
                      <tr>
                        <td style="padding:15px 0;text-align:right;">
                          <span style="font-size:13px;color:#999999;text-transform:uppercase;letter-spacing:1px;">Grand Total</span>
                          <span style="font-size:18px;color:#600018;font-weight:bold;margin-left:20px;">₹${order.totalAmount?.toLocaleString()}</span>
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

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${toEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send order confirmation:`, error.message);
  }
};

// ─── OTP Email ────────────────────────────────────────────────────────────
const sendOtpEmail = async (toEmail, userName, otp) => {
  const mailOptions = {
    from: `"Bharti Glooms 🌸" <${COMPANY_EMAIL}>`,
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
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${toEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send OTP to ${toEmail}:`, error.message);
    throw error;
  }
};

// ─── Complaint Notification Email (To Admin) ──────────────────────────────
const sendComplaintNotification = async (name, email, subject, message) => {
  const mailOptions = {
    from: `"Bharti Glooms Support 🌸" <${COMPANY_EMAIL}>`,
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
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Complaint notification sent to admin`);
  } catch (error) {
    console.error(`❌ Failed to send complaint notification:`, error.message);
  }
};

// Function to send a reply to a customer inquiry
const sendReplyEmail = async (to, originalSubject, replyMessage, originalMessage) => {
  const mailOptions = {
    from: `"Bharti Glooms Support 🌸" <${process.env.EMAIL_USER || 'bhartiglooms@gmail.com'}>`,
    to: to,
    subject: `Re: ${originalSubject} - Bharti Glooms Support`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #600018; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">BHARTI GLOOMS</h1>
          <p style="color: #fbd38d; margin: 5px 0 0; font-size: 14px; text-transform: uppercase; font-weight: 600;">Customer Support Reply</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #2d3748; line-height: 1.6; margin-bottom: 25px;">
            Hello,
          </p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #600018; padding: 20px; margin-bottom: 30px; border-radius: 0 8px 8px 0;">
            <p style="font-size: 16px; color: #1a202c; line-height: 1.8; margin: 0; font-style: italic;">
              "${replyMessage}"
            </p>
          </div>

          <p style="font-size: 14px; color: #718096; margin-top: 40px; border-top: 1px solid #edf2f7; padding-top: 20px;">
            Thank you for reaching out to us. If you have any further questions, please feel free to reply to this email.
          </p>
        </div>

        <div style="background-color: #f7fafc; padding: 25px; border-top: 1px solid #edf2f7;">
          <p style="font-size: 12px; color: #a0aec0; margin-bottom: 10px; font-weight: 600; text-transform: uppercase;">Original Inquiry Details:</p>
          <p style="font-size: 13px; color: #4a5568; margin: 5px 0;"><strong>Subject:</strong> ${originalSubject}</p>
          <p style="font-size: 13px; color: #4a5568; margin: 5px 0;"><strong>Your Message:</strong> ${originalMessage}</p>
        </div>
        
        <div style="background-color: #600018; padding: 20px; text-align: center;">
          <p style="color: #ffffff; margin: 0; font-size: 12px; opacity: 0.8;">
            © ${new Date().getFullYear()} Bharti Glooms. Designed for Elegance.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reply email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending reply email:', error);
    throw error;
  }
};

module.exports = { 
  sendWelcomeEmail, 
  sendOrderConfirmationEmail, 
  sendOtpEmail, 
  sendComplaintNotification,
  sendReplyEmail
};
