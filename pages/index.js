import { useState } from 'react';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to shorten URL, please nter the URL');
      }

      const data = await res.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate QR Code');
      }

      const data = await res.json();
      setQrCode(data.qrPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter the Link here"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shortUrl && (
        <div style={{ marginBottom: '20px' }}>
          <p>
            Short URL: <a href={shortUrl}>{shortUrl}</a>
          </p>
          <button onClick={handleGenerateQR} style={{ padding: '10px 20px' }}>
            {loading ? 'Generating QR...' : 'Generate QR Code'}
          </button>
        </div>
      )}

      {qrCode && (
        <div>
          <img src={qrCode} alt="QR Code" style={{ marginBottom: '10px' }} />
          <br />
          <a
            href={qrCode}
            download={`${shortUrl}.png`}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            Download QR Code
          </a>
        </div>
      )}
    </div>
  );
}
