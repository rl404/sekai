// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Data as Base } from "../../../index";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = Base & {
  data: UserAnimeRelation;
};

export type UserAnimeRelation = {
  nodes: UserAnimeRelationNode[];
  links: UserAnimeRelationLink[];
};

type UserAnimeRelationNode = {
  anime_id: number;
  title: string;
  status: string;
  score: number;
  type: string;
  source: string;
  start_year: number;
  episode_count: number;
  episode_duration: number;
  season: string;
  season_year: number;
  user_anime_status: string;
  user_anime_score: number;
  user_episode_count: number;
};

type UserAnimeRelationLink = {
  anime_id1: number;
  anime_id2: number;
  relation: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const resp = await fetch(`${process.env.API_HOST_AKATSUKI}/user/${req.query.username}/anime/relations`, {
    method: req.method,
  });
  const data = await resp.json();
  res
    .status(data.status)
    .setHeader("cache-control", "max-age=3600, s-maxage=86400, stale-while-revalidate=3600")
    .json(data);
}
