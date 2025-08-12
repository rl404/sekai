import { AnimeRelation, AnimeStatus, AnimeType, Day, Season } from '@/src/libs/constant';

export type AnimeDrawerType = {
  id: number;
  title: string;
  titleSynonyms: string[];
  titleEnglish: string;
  titleJapanese: string;
  pictures: string[];
  synopsis: string;
  startDate: string;
  endDate: string;
  type: AnimeType;
  status: AnimeStatus;
  rank: number;
  mean: number;
  popularity: number;
  stats: StatsStatus;
  episodeCount: number;
  episodeDuration: string;
  season: Season;
  seasonYear: number;
  broadcastDay: Day;
  broadcastTime: string;
  genres: string[];
  related: Related[];
  extendedRelated: Related[];
};

type StatsStatus = {
  watching: number;
  completed: number;
  onHold: number;
  dropped: number;
  planned: number;
};

type Related = {
  id: number;
  title: string;
  picture: string;
  relation: AnimeRelation;
};

export const defaultAnimeDrawer: AnimeDrawerType = {
  id: 0,
  title: '',
  titleSynonyms: [],
  titleEnglish: '',
  titleJapanese: '',
  pictures: [],
  synopsis: '',
  startDate: '',
  endDate: '',
  type: AnimeType[''],
  status: AnimeStatus[''],
  rank: 0,
  mean: 0,
  popularity: 0,
  stats: {
    watching: 0,
    completed: 0,
    onHold: 0,
    dropped: 0,
    planned: 0,
  },
  episodeCount: 0,
  episodeDuration: '',
  season: Season[''],
  seasonYear: 0,
  broadcastDay: Day[''],
  broadcastTime: '',
  genres: [],
  related: [],
  extendedRelated: [],
};
