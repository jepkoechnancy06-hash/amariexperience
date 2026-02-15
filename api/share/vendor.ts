import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db.js';

function getBaseUrl(req: VercelRequest) {
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const host = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string) || '';
  return `${proto}://${host}`;
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      res.status(405).send('Method not allowed');
      return;
    }

    const vendorId = (req.query.id as string | undefined) || '';
    if (!vendorId) {
      res.status(400).send('Missing vendor id');
      return;
    }

    // Validate UUID format to prevent injection
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vendorId)) {
      res.status(400).send('Invalid vendor id');
      return;
    }

    const baseUrl = getBaseUrl(req);
    const shareUrl = `${baseUrl}/share/vendor/${encodeURIComponent(vendorId)}`;
    const redirectUrl = `${baseUrl}/#/vendor/${encodeURIComponent(vendorId)}`;

    let vendor: any | null = null;

    try {
      const sql = getSql();
      const rows = await sql`
        SELECT id, name, category, description, image_url, location
        FROM vendors
        WHERE id = ${vendorId} AND approved_at IS NOT NULL
        LIMIT 1;
      `;
      vendor = rows && rows.length > 0 ? rows[0] : null;
    } catch (e: any) {
      console.error('Share vendor fetch failed:', e?.message);
    }

    const title = vendor?.name ? `${vendor.name} | Amari Experience` : 'Vendor Profile | Amari Experience';
    const description = vendor?.description
      ? String(vendor.description).slice(0, 180)
      : 'Explore verified wedding vendors on the Kenya coast with Amari Experience.';

    const ogImage = vendorId
      ? `${baseUrl}/api/og/vendor?id=${encodeURIComponent(vendorId)}`
      : `${baseUrl}/beach.jpeg`;

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:url" content="${escapeHtml(shareUrl)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

  <meta http-equiv="refresh" content="0;url=${escapeHtml(redirectUrl)}" />
</head>
<body>
  <p>Redirecting…</p>
  <script>
    window.location.replace(${JSON.stringify(redirectUrl)});
  </script>
  <noscript>
    <a href="${escapeHtml(redirectUrl)}">Open vendor profile</a>
  </noscript>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    res.status(200).send(html);
  } catch (fatal: any) {
    console.error('Share vendor fatal:', fatal?.message);
    res.status(500).send('Internal server error');
  }
}
