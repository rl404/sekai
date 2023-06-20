// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { Data as Base } from "../index";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = Base & {
  data: Anime;
};

export type Anime = {
  id: number;
  title: string;
  alternative_titles: AlternativeTitle;
  picture: string;
  pictures: string[];
  synopsis: string;
  start_date: Date;
  end_date: Date;
  type: string;
  status: string;
  rank: number;
  mean: number;
  popularity: number;
  stats: Stats;
  episode: Episode;
  season: Season;
  broadcast: Broadcast;
  genres: Genre[];
  related: Related[];
};

type AlternativeTitle = {
  synonyms: string[];
  english: string;
  japanese: string;
};

export type Date = {
  year: number;
  month: number;
  day: number;
};

type Stats = {
  status: StatsStatus;
};

type Episode = {
  count: number;
  duration: number;
};

type Season = {
  season: string;
  year: number;
};

type Broadcast = {
  day: string;
  time: string;
};

export type Related = {
  id: number;
  title: string;
  picture: string;
  relation: string;
};

type StatsStatus = {
  watching: number;
  completed: number;
  on_hold: number;
  dropped: number;
  planned: number;
};

export type Genre = {
  id: number;
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const resp = await fetch(`${process.env.API_HOST_AKATSUKI}/anime/${req.query.anime_id}`, {
    method: req.method,
  });
  const data = await resp.json();
  res
    .status(data.status)
    .setHeader("cache-control", "max-age=3600, s-maxage=86400, stale-while-revalidate=3600")
    .json(data);
}
