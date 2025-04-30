import { UserAnimeRelation } from '@/app/api/user/[username]/anime/relations/route';
import { Graph, Node } from '@/components/graphs/types';

export const getNodesLinks = (data: UserAnimeRelation): Graph => {
  const result: Graph = { nodes: [], links: [] };

  result.nodes = data.nodes.map((n) => ({
    id: n.anime_id,
    animeID: n.anime_id,
    title: n.title,
    status: n.status,
    score: n.score,
    type: n.type,
    source: n.source,
    startYear: n.start_year,
    episodeCount: n.episode_count,
    episodeDuration: n.episode_duration,
    season: n.season,
    seasonYear: n.season_year,
    userAnimeStatus: n.user_anime_status,
    userAnimeScore: n.user_anime_score,
    userEpisodeCount: n.user_episode_count,
    scoreDiff: n.score > 0 && n.user_anime_score > 0 ? n.user_anime_score - n.score : 0,
    neighbors: [],
    links: [],
  }));

  result.links = data.links
    .filter((l) => result.nodes.find((n) => n.id === l.anime_id1) && result.nodes.find((n) => n.id === l.anime_id2))
    .map((l) => {
      const link = {
        source: l.anime_id1,
        sourceID: l.anime_id1,
        target: l.anime_id2,
        targetID: l.anime_id2,
        relation: l.relation,
      };

      const a = result.nodes.find((n: Node) => n.id === link.source);
      const b = result.nodes.find((n: Node) => n.id === link.target);

      if (a && !a.neighbors) a.neighbors = [];
      if (b && !b.neighbors) b.neighbors = [];

      if (a && b) a.neighbors.push(b);
      if (a && b) b.neighbors.push(a);

      if (a && !a.links) a.links = [];
      if (b && !b.links) b.links = [];

      if (a) a.links.push(link);
      if (b) b.links.push(link);

      return link;
    });

  result.nodes.forEach((n) => {
    n.neighbors = Array.from(new Set(n.neighbors));
    n.links = Array.from(new Set(n.links));
  });

  return result;
};
