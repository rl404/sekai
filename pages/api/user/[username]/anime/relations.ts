// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserAnimeRelation } from '../../../../../types/Types';

type Data = {
  status: number;
  message: string;
  data: UserAnimeRelation;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const resp = await fetch(
    `${process.env.API_HOST_AKATSUKI}/user/${req.query.username}/anime/relations`,
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
