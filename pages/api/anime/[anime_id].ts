// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  status: Number;
  message: string;
  data: {};
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const resp = await fetch(
    `${process.env.API_HOST_AKATSUKI}/anime/${req.query.anime_id}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: req.method,
    },
  );
  const data = await resp.json();
  res.status(data.status).json(data);
}
