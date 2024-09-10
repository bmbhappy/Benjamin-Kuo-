   export default async function handler(req, res) {
     if (req.method === 'POST') {
       const { name, email, message } = req.body;
       // 這裡處理表單數據，例如發送電子郵件或保存到數據庫
       console.log('Received message:', { name, email, message });
       
       // 發送確認郵件（需要設置郵件服務）
       // await sendEmail(email, 'Thank you for your message', '...');

       res.status(200).json({ message: 'Message received' });
     } else {
       res.setHeader('Allow', ['POST']);
       res.status(405).end(`Method ${req.method} Not Allowed`);
     }
   }
