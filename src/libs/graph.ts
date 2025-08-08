import { UserAnimeRelation } from '@/app/api/user/[username]/anime/relations/route';
import { Graph, Link, Node } from '@/src/components/graphs/types';

export const defaultNodeColor = 'rgba(255,255,255,0.1)';
export const defaultLinkColor = 'rgba(255,255,255,0.1)';
export const activeLinkColor = 'white';

export const getNodesLinks = (data: UserAnimeRelation): Graph => {
  const nodes = data.nodes.map<Node>((n) => ({
    id: n.anime_id,
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
  }));

  const nodeMap = getNodeMap(nodes);

  const links = data.links
    .filter((l) => nodeMap.get(l.anime_id1) && nodeMap.get(l.anime_id2))
    .map<Link>((l) => {
      const a = nodeMap.get(l.anime_id1);
      const b = nodeMap.get(l.anime_id2);

      if (a && !a.neighbors) a.neighbors = [];
      if (b && !b.neighbors) b.neighbors = [];

      if (a && b) a.neighbors.push(b.id);
      if (a && b) b.neighbors.push(a.id);

      return {
        source: l.anime_id1,
        sourceID: l.anime_id1,
        target: l.anime_id2,
        targetID: l.anime_id2,
        relation: l.relation,
      };
    });

  return {
    nodes: nodes.map((n) => ({
      ...n,
      neighbors: [...new Set(n.neighbors)],
    })),
    links: uniqueLinks(links),
  };
};

export const uniqueNodes = (nodes: Node[]): Node[] => {
  return nodes.filter((n, i, all) => all.findIndex((a) => a.id === n.id) === i);
};

export const hasNode = (nodes: Node[], node: Node): boolean => {
  return nodes.findIndex((n) => n.id === node.id) !== -1;
};

export const uniqueLinks = (links: Link[]): Link[] => {
  return links.filter(
    (l, i, all) =>
      all.findIndex((a) => a.sourceID === l.sourceID && a.targetID === l.targetID && a.relation === l.relation) === i,
  );
};

export const hasLink = (links: Link[], link: Link): boolean => {
  return (
    links.findIndex(
      (l) => l.sourceID === link.sourceID && l.targetID === link.targetID && l.relation === link.relation,
    ) !== -1
  );
};

export const getNodeMap = (nodes: Node[]): Map<number, Node> => {
  const map = new Map<number, Node>();
  for (const node of nodes) {
    map.set(node.id, node);
  }
  return map;
};

export const getRelatedIDs = (nodes: Node[], id: number, extended: boolean): number[] => {
  const done = new Set<number>();
  const idToNode = getNodeMap(nodes);

  const dfs = (id2: number) => {
    if (done.has(id2)) return;
    done.add(id2);

    const node = idToNode.get(id2);
    if (!node) return;

    for (const neighborID of node.neighbors) {
      if (!extended) {
        done.add(neighborID);
      } else {
        dfs(neighborID);
      }
    }
  };

  dfs(id);

  return Array.from(done);
};
