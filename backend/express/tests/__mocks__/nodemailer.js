const nodemailer = {
  createTransport() {
    return this;
  },
  sendMail() {}
};

module.exports = nodemailer;
