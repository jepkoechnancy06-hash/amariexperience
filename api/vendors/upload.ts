import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from '../_lib/db.js';

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const body = (req.body || {}) as any;
    const { fileCategory, fileName, mimeType, fileData } = body;

    if (!fileCategory || !fileData) {
      res.status(400).json({ error: 'fileCategory and fileData are required' });
      return;
    }

    if (!['verification_document', 'real_work_image'].includes(fileCategory)) {
      res.status(400).json({ error: 'fileCategory must be verification_document or real_work_image' });
      return;
    }

    // Validate base64 data URL format
    if (typeof fileData !== 'string' || !fileData.startsWith('data:')) {
      res.status(400).json({ error: 'fileData must be a base64 data URL' });
      return;
    }

    // Estimate raw file size from base64 length
    const base64Part = fileData.split(',')[1] || '';
    const estimatedSize = Math.ceil(base64Part.length * 0.75);
    if (estimatedSize > MAX_FILE_SIZE) {
      res.status(413).json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` });
      return;
    }

    const sql = getSql();

    const rows = await sql`
      INSERT INTO vendor_files (file_category, original_name, mime_type, file_size, file_data)
      VALUES (${fileCategory}, ${fileName || null}, ${mimeType || null}, ${estimatedSize}, ${fileData})
      RETURNING id;
    `;

    const fileId = rows[0]?.id;
    if (!fileId) {
      res.status(500).json({ error: 'Failed to store file' });
      return;
    }

    res.status(201).json({
      ok: true,
      file: {
        id: fileId,
        url: `/api/files?id=${fileId}`,
        fileName: fileName || null,
        mimeType: mimeType || null,
        size: estimatedSize
      }
    });
  } catch (e: any) {
    console.error('File upload error:', e?.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}
