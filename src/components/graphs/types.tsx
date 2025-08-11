import { LinkObject, NodeObject } from 'react-force-graph-2d';
import { AnimeRelation, AnimeSource, AnimeStatus, AnimeType, Season, UserAnimeStatus } from '@/src/libs/constant';

export type Graph = {
  nodes: Node[];
  links: Link[];
};

export type Node = NodeObject<{
  id: number;
  title: string;
  status: AnimeStatus;
  score: number;
  type: AnimeType;
  source: AnimeSource;
  startYear: number;
  episodeCount: number;
  episodeDuration: number;
  season: Season;
  seasonYear: number;
  userAnimeStatus: UserAnimeStatus;
  userAnimeScore: number;
  userEpisodeCount: number;
  scoreDiff: number;
  neighbors: number[];
}>;

export type Link = LinkObject<
  Node,
  {
    sourceID: number;
    targetID: number;
    relation: AnimeRelation;
  }
>;
