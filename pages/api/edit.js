import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { shortUrl, newLongUrl } = req.body;

    if (!shortUrl || !newLongUrl) {
      return res
        .status(400)
        .json({ error: 'Short URL and new Long URL are required' });
    }

    try {
      const [rows] = await db.execute(
        'UPDATE urls SET long_url = ? WHERE short_url = ?',
        [newLongUrl, shortUrl]
      );

      if (rows.affectedRows === 0) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

      res.status(200).json({ message: 'URL updated successfully' });
    } catch (error) {
      console.error('Error updating URL:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
