require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
  };
  
  const sendOTPEmail = async (email, username) => {
    const otp = generateOTP(); // Generate OTP
    const mailOptions = {
      from: process.env.EMAIL_HOST,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Dear ${username},
  
  Your OTP for resetting your password is: ${otp}
  
  Please use this OTP to complete the password reset process. This OTP is valid for 10 minutes.
  
  If you did not request a password reset, please ignore this email.
  
  Best regards,
  Book My Doc`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully');
      return otp; // Return the generated OTP for further processing
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  };

  const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_HOST,
        to,  // This should be a string containing the recipient's email address
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendOTPEmail,sendEmail };
