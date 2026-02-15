import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitizeFileName(name: string): string {
  // Strip anything that isn't alphanumeric, dash, underscore, dot, or space
  return name.replace(/[^a-zA-Z0-9._\- ]/g, '_').substring(0, 200);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const fileId = req.query.id as string | undefined;
    if (!fileId) {
      res.status(400).json({ error: 'File id is required' });
      return;
    }

    if (!UUID_RE.test(fileId)) {
      res.status(400).json({ error: 'Invalid file id format' });
      return;
    }

    const sql = getSql();

    const rows = await sql`
      SELECT mime_type, original_name, file_data
      FROM vendor_files
      WHERE id = ${fileId}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    const file = rows[0];
    const dataUrl: string = file.file_data;

    // Parse the data URL: data:<mime>;base64,<payload>
    const commaIndex = dataUrl.indexOf(',');
    if (commaIndex === -1) {
      res.status(500).json({ error: 'Invalid file data' });
      return;
    }

    const base64Payload = dataUrl.substring(commaIndex + 1);
    const buffer = Buffer.from(base64Payload, 'base64');

    const mimeType = file.mime_type || 'application/octet-stream';
    const fileName = sanitizeFileName(file.original_name || `file-${fileId}`);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', String(buffer.length));
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Cache for 1 hour — files are immutable once uploaded
    res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
    res.send(buffer);
  } catch (e: any) {
    console.error('File serve error:', e?.message);
    res.status(500).json({ error: 'Failed to serve file' });
  }
}
