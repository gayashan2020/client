// src\pages\api\users\sendEmail.js

import sendgrid from '@sendgrid/mail';
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Extract email data from request body
      const { to, subject, html } = req.body;

      // Define email options
      const msg = {
        to, // recipient
        from: 'gayashanweerasundara@gmail.com',
        subject,
        html,
      };

      // Send the email
      await sendgrid.send(msg);

      // Send a JSON response back
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    // Handle any requests that aren't POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
