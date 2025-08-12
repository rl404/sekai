import { Base } from '@/app/api';
import { AnimeRelation, AnimeSource, AnimeStatus, AnimeType, Season, UserAnimeStatus } from '@/src/libs/constant';

export type Data = Base & {
  data: UserAnimeRelation;
};

export type UserAnimeRelation = {
  nodes: UserAnimeRelationNode[];
  links: UserAnimeRelationLink[];
};

type UserAnimeRelationNode = {
  anime_id: number;
  title: string;
  status: AnimeStatus;
  score: number;
  type: AnimeType;
  source: AnimeSource;
  start_year: number;
  episode_count: number;
  episode_duration: number;
  season: Season;
  season_year: number;
  user_anime_status: UserAnimeStatus;
  user_anime_score: number;
  user_episode_count: number;
};

type UserAnimeRelationLink = {
  anime_id1: number;
  anime_id2: number;
  relation: AnimeRelation;
};

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const resp = await fetch(`${process.env.API_HOST_AKATSUKI}/user/${username}/anime/relations`);
  const data = await resp.json();
  return Response.json(data, {
    status: resp.status,
    headers: {
      'cache-control': 'max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}
