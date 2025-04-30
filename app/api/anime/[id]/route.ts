import { Base } from '@/app/api';

export type Data = Base & {
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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resp = await fetch(`${process.env.API_HOST_AKATSUKI}/anime/${id}`);
  const data = await resp.json();
  return Response.json(data, {
    status: resp.status,
    headers: {
      'cache-control': 'max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
