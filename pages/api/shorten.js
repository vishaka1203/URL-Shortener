import db from '../../lib/db';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      // Generate a unique 8-character string
      const shortUrl = nanoid(8);

      // Check if the long URL already exists
      const [existing] = await db.execute(
        'SELECT short_url FROM urls WHERE long_url = ?',
        [longUrl]
      );

      if (existing.length > 0) {
        // If exists, return the existing short URL
        return res.status(200).json({ shortUrl: existing[0].short_url });
      }

      // Insert new long URL with the generated short URL
      await db.execute('INSERT INTO urls (long_url, short_url) VALUES (?, ?)', [
        longUrl,
        shortUrl,
      ]);

      // Return the newly generated short URL
      res.status(200).json({ shortUrl });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
