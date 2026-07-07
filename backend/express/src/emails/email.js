const nodeMailer = require('nodemailer');
const sender = process.env.email;
const password = process.env.password;

const sendWelcomeEmail = (receiver, name) => {
  const transporter = nodeMailer.createTransport({
    service: 'hotmail',
    auth: {
      user: sender,
      pass: password
    }
  });

  const template = `<h1>Welcome ${name}</h1>
        <br>
        <p>Welcome ${receiver} to Task Manager Application, here you can create and manage your daily tasks</p>
        `;

  const mailOptions = {
    from: sender,
    to: receiver,
    subject: 'Account Created',
    html: template
  };

  transporter.sendMail(mailOptions);
};

const sendCancellationEmail = receiver => {
  const transporter = nodeMailer.createTransport({
    service: 'hotmail',
    auth: {
      user: sender,
      pass: password
    }
  });

  const template = `<p>Account with ${receiver} is deleted</p>`;

  const mailOptions = {
    from: sender,
    to: receiver,
    subject: 'Account Deleted',
    html: template
  };

  transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail, sendCancellationEmail };
