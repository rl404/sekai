export type Graph = {
  nodes: Node[];
  links: Link[];
};

export type Node = {
  id: number;
  animeID: number;
  title: string;
  status: string;
  score: number;
  type: string;
  source: string;
  startYear: number;
  episodeCount: number;
  episodeDuration: number;
  season: string;
  seasonYear: number;
  userAnimeStatus: string;
  userAnimeScore: number;
  userEpisodeCount: number;
  scoreDiff: number;
  neighbors: Node[];
  links: Link[];
};

export type Link = {
  sourceID: number;
  source: number;
  targetID: number;
  target: number;
  relation: string;
};
