import db from '../../lib/db';

export default async function handler(req, res) {
  const { shortUrl } = req.query;

  try {
    const [result] = await db.query(
      'SELECT long_url FROM urls WHERE short_url = ?',
      [shortUrl]
    );

    if (result.length > 0) {
      const longUrl = result[0].long_url;
      res.redirect(301, longUrl); // Redirect with 301 status code
    } else {
      res.status(404).send('URL not found'); // Handle case where URL doesn't exist
    }
  } catch (error) {
    console.error('Error fetching the URL:', error);
    res.status(500).send('Internal Server Error');
  }
}
