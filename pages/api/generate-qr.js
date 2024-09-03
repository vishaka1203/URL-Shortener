import db from '../../lib/db';
import QRCode from 'qrcode';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { shortUrl } = req.body;

    if (!shortUrl) {
      return res.status(400).json({ error: 'Short URL is required' });
    }

    try {
      const [rows] = await db.execute(
        'SELECT long_url FROM urls WHERE short_url = ?',
        [shortUrl]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

      const longUrl = rows[0].long_url;

      // Save QR code image in the public directory
      const qrPath = path.join(process.cwd(), 'public', `${shortUrl}.png`);
      await QRCode.toFile(qrPath, longUrl);

      // Return the relative URL to access the QR code
      res.status(200).json({ qrPath: `/${shortUrl}.png` });
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
