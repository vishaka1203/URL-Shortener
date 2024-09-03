import db from '../lib/db';

export async function getServerSideProps(context) {
  const { shortUrl } = context.params;

  try {
    // Look for the short URL in the database
    const [rows] = await db.query(
      'SELECT long_url FROM urls WHERE short_url = ?',
      [shortUrl]
    );

    if (rows.length > 0) {
      const longUrl = rows[0].long_url;
      // Redirect to the original long URL
      return {
        redirect: {
          destination: longUrl,
          permanent: false,
        },
      };
    } else {
      // If no URL is found, return a 404 page
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error('Error fetching the URL:', error);
    return {
      notFound: true,
    };
  }
}

export default function ShortUrlPage() {
  return <div>Redirecting...</div>; // This will be shown briefly before the redirect
}
