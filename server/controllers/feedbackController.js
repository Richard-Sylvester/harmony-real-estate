const nodemailer = require('nodemailer');

const sendFeedback = async (req, res) => {
  const { name, email, rating, type, message } = req.body;

  try {
    // Configure Nodemailer for Hostinger
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Must match authenticated user
      to: process.env.EMAIL_USER,   // Sending it to yourself
      replyTo: email,               // Allows you to hit "Reply" and email the user back
      subject: `New Harmony Feedback: ${type} (${rating} Stars)`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1b263b; max-width: 600px; margin: auto;">
          <h2 style="color: #C5A059; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">New Feedback Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Rating:</strong> ${rating} / 5 Stars</p>
          <p><strong>Type:</strong> ${type}</p>
          <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #C5A059; margin-top: 20px;">
            <p style="margin: 0; font-style: italic;">"${message}"</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Feedback sent successfully!' });
  } catch (error) {
    console.error('Feedback Email Error:', error);
    res.status(500).json({ message: 'Failed to send feedback.' });
  }
};

module.exports = { sendFeedback };