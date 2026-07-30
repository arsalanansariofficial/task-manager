const nodeMailer = require('nodemailer');
const sender = process.env.email;
const {password} = process.env;

const sendWelcomeEmail = (receiver, name) => {
  const transporter = nodeMailer.createTransport({
    auth: { pass: password, user: sender },
    service: 'hotmail'
  });

  const template = `<h1>Welcome ${name}</h1>
        <br>
        <p>Welcome ${receiver} to Task Manager Application, here you can create and manage your daily tasks</p>
        `;

  const mailOptions = {
    subject: 'Account Created',
    html: template,
    from: sender,
    to: receiver
  };

  transporter.sendMail(mailOptions);
};

const sendCancellationEmail = receiver => {
  const transporter = nodeMailer.createTransport({
    auth: { pass: password, user: sender },
    service: 'hotmail'
  });

  const template = `<p>Account with ${receiver} is deleted</p>`;

  const mailOptions = {
    subject: 'Account Deleted',
    html: template,
    from: sender,
    to: receiver
  };

  transporter.sendMail(mailOptions);
};

module.exports = { sendCancellationEmail, sendWelcomeEmail };
