// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Anime } from '../../../types/Types';

type Data = {
  status: number;
  message: string;
  data: Anime;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const resp = await fetch(`${process.env.API_HOST_AKATSUKI}/anime/${req.query.anime_id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: req.method,
  });
  const data = await resp.json();
  res.status(data.status).json(data);
}
