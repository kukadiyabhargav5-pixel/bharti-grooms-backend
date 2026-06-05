const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'bhartiglooms@gmail.com',
    pass: process.env.EMAIL_PASS || 'rfkoehhqsicppagn'
  }
});

async function test() {
  console.log('🧪 Testing Mail with User:', process.env.EMAIL_USER || 'bhartiglooms@gmail.com');
  try {
    await transporter.verify();
    console.log('✅ SMTP Connection Verified');
    
    const info = await transporter.sendMail({
      from: '"Bharti Glooms Test" <bhartiglooms@gmail.com>',
      to: 'bhartiglooms@gmail.com',
      subject: 'Test Email from Autopilot',
      text: 'If you see this, the mail system is working perfectly!',
      html: '<b>If you see this, the mail system is working perfectly!</b>'
    });
    
    console.log('✅ Email Sent Successfully!');
    console.log('Message ID:', info.messageId);
    process.exit(0);
  } catch (error) {
    console.error('❌ Mail Test Failed:');
    console.error(error);
    process.exit(1);
  }
}

test();
