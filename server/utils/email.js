const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file
const templates = require('./templates');

class Email {
  constructor(user) {
    this.to = user.email;
    this.name = user.name;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.SMTP_SERVER, 
      port: process.env.SMTP_PORT, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });
  }

  async send(subject, html) {
    const mailOptions = {
      from: process.env.SMTP_USER, // Your email address
      to: this.to,
      subject,
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('🎵 Welcome to Spotify 🎧', templates.welcomeTemplate());
  }

  async sendResetToken(resetToken) {
    await this.send('Reset token', templates.resetTokenTemplate(resetToken));
  }
}

module.exports = Email;
