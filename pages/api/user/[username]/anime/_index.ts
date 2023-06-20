// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: number;
  message: string;
  data: UserAnime[];
};

type UserAnime = {
  anime_id: number;
  status: string;
  score: number;
  episode: number;
  tags: string[];
  comment: string;
  updated_at: Date;
};

type Date = {
  year: number;
  month: number;
  day: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const resp = await fetch(
    `${process.env.API_HOST_AKATSUKI}/user/${req.query.username}/anime?page=${req.query.page}&limit=${req.query.limit}`,
    { method: req.method }
  );
  const data = await resp.json();
  res.status(data.status).json(data);
}
