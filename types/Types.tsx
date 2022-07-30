export interface UserAnime {
  anime_id: Number;
  status: string;
  score: Number;
  episode: Number;
  tags: Array<string>;
  comment: string;
  updated_at: Date;
}

export interface UserAnimeRelation {
  nodes: Array<UserAnimeRelationNode>;
  links: Array<UserAnimeRelationLink>;
}

export interface UserAnimeRelationNode {
  anime_id: Number;
  title: string;
  status: string;
  score: Number;
  type: string;
  user_anime_status: string;
}

export interface UserAnimeRelationLink {
  anime_id1: Number;
  anime_id2: Number;
  relation: string;
}

export interface GraphData {
  nodes: Array<GraphNode>;
  links: Array<GraphLink>;
}

export interface GraphNode {
  id: Number;
  anime_id: Number;
  title: string;
  status: string;
  score: Number;
  type: string;
  user_anime_status: string;
  neighbors: Array<GraphNode>;
  links: Array<GraphLink>;
}

export interface GraphLink {
  source: Number;
  target: Number;
  relation: string;
}
