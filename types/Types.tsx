export interface Anime {
  id: number;
  title: string;
  alternative_titles: AlternativeTitle;
  picture: string;
  pictures: Array<string>;
  synopsis: string;
  start_date: Date;
  end_date: Date;
  type: string;
  status: string;
  rank: number;
  mean: number;
  popularity: number;
  stats: Stats;
  genres: Array<Genre>;
  related: Array<Related>;
}

interface AlternativeTitle {
  synonyms: Array<string>;
  english: string;
  japanese: string;
}

export interface Date {
  year: number;
  month: number;
  day: number;
}

interface Stats {
  status: StatsStatus;
}

interface Related {
  id: number;
  title: string;
  picture: string;
  relation: string;
}

interface StatsStatus {
  watching: number;
  completed: number;
  on_hold: number;
  dropped: number;
  planned: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface UserAnime {
  anime_id: number;
  status: string;
  score: number;
  episode: number;
  tags: Array<string>;
  comment: string;
  updated_at: Date;
}

export interface UserAnimeRelation {
  nodes: Array<UserAnimeRelationNode>;
  links: Array<UserAnimeRelationLink>;
}

export interface UserAnimeRelationNode {
  anime_id: number;
  title: string;
  status: string;
  score: number;
  type: string;
  user_anime_status: string;
  user_anime_score: number;
}

export interface UserAnimeRelationLink {
  anime_id1: number;
  anime_id2: number;
  relation: string;
}

export interface GraphData {
  nodes: Array<GraphNode>;
  links: Array<GraphLink>;
}

export interface GraphNode {
  id: number;
  anime_id: number;
  title: string;
  status: string;
  score: number;
  type: string;
  user_anime_status: string;
  user_anime_score: number;
  neighbors: Array<GraphNode>;
  links: Array<GraphLink>;
}

export interface GraphLink {
  source: number;
  target: number;
  relation: string;
}

export interface InitDialogState {
  open: boolean;
}

export interface ListDialogState {
  open: boolean;
}

export interface ConfigDialogState {
  open: boolean;
}

export interface ConfigState {
  username: string;
  showDetailOnClick: boolean;
  showTitle: boolean;
  showRelation: boolean;
  search: string;
}

export interface AnimeDrawerState {
  open: boolean;
  anime_id: number;
}

export interface AnimeDrawerData {
  id: number;
  title: string;
  title_synonyms: Array<string>;
  title_english: string;
  title_japanese: string;
  pictures: Array<string>;
  synopsis: string;
  start_date: string;
  end_date: string;
  type: string;
  status: string;
  rank: number;
  mean: number;
  popularity: number;
  stats: StatsStatus;
  genres: Array<string>;
  related: Array<Related>;

  loading: boolean;
  error: string;
}

type align = 'left' | 'center' | 'right';

export interface TableHeader {
  key: string;
  label: string;
  align?: align;
}

export interface TableData {
  id: number;
  anime_id: number;
  title: string;
  status: string;
  score: number;
  type: string;
  user_anime_status: string;
  user_anime_score: number;
}
