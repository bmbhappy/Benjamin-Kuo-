export default async function handler(req, res) {
  let MailerSend, EmailParams, Sender, Recipient;
  try {
    const mailersend = await import('mailersend');
    MailerSend = mailersend.MailerSend;
    EmailParams = mailersend.EmailParams;
    Sender = mailersend.Sender;
    Recipient = mailersend.Recipient;
  } catch (error) {
    console.error('Error importing mailersend:', error);
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
  });

  async function sendEmail(to, subject, text) {
    const sentFrom = new Sender("noreply@yourdomain.com", "Benjamin Kuo 健身工作室");
    const recipients = [new Recipient(to)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setText(text);

    try {
      const response = await mailerSend.email.send(emailParams);
      console.log('Email sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      
      console.log('Received data:', { name, email, message });

      await sendEmail(
        email,
        '感謝您的訊息 - Benjamin Kuo 健身工作室',
        `親愛的 ${name}，

感謝您聯繫 Benjamin Kuo 健身工作室。我們已經收到您的訊息，並將盡快回覆您。

以下是您提交的訊息摘要：

${message}

準備好迎接極限挑戰了嗎？我們期待能夠幫助您實現您的健身目標。

最佳祝福，
Benjamin Kuo 健身團隊`
      );

      res.status(200).json({ message: 'Message received and confirmation sent' });
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ error: 'Error processing your request', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
