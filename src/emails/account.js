const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function welcome({ email, name }) {
  console.log(email, name);
  sgMail.send({
    to: email,
    from: 's.kim.castro@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
}

function cancel({ email, name }) {
  sgMail.send({
    to: email,
    from: 's.kim.castro@gmail.com',
    subject: 'Your account has been deleted',
    text: `Goodbye, ${name}. I hope to see youback sometime soon.`,
  });
}

module.exports = {
  welcome,
  cancel,
};
