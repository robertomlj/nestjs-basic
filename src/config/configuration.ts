export default () => ({
  mailer: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    redis: {
      host: process.env.QUEUE_HOST,
      port: parseInt(process.env.QUEUE_PORT),
    },
  },
});
