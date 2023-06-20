import { Graph } from "@/components/graphs/types";
import { UserAnimeRelation } from "@/pages/api/user/[username]/anime/relations";

export const getNodesLinks = (data: UserAnimeRelation): Graph => {
  let result: Graph = { nodes: [], links: [] };

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

      const a = result.nodes.find((n: any) => n.id === link.source);
      const b = result.nodes.find((n: any) => n.id === link.target);

      a && !a.neighbors && (a.neighbors = []);
      b && !b.neighbors && (b.neighbors = []);

      a && b && a.neighbors.push(b);
      a && b && b.neighbors.push(a);

      a && !a.links && (a.links = []);
      b && !b.links && (b.links = []);

      a && a.links.push(link);
      b && b.links.push(link);

      return link;
    });

  result.nodes.forEach((n) => {
    n.neighbors = Array.from(new Set(n.neighbors));
    n.links = Array.from(new Set(n.links));
  });

  return result;
};
