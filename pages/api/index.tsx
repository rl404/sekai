// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const resp = await fetch(`${process.env.API_HOST_AKATSUKI}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: req.method,
  });
  const data = await resp.json();
  res.status(data.status).json(data);
}
