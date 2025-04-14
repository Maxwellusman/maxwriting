// pages/api/upload.ts
import { put } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fs = await import('fs/promises');
    const fileBuffer = await fs.readFile(file.filepath);

    const blob = await put(
      `featured-images/${Date.now()}-${file.originalFilename}`,
      fileBuffer,
      {
        access: 'public',
        contentType: file.mimetype || 'image/jpeg'
      }
    );

    return res.status(200).json({ imageUrl: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}