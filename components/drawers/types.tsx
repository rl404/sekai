export type AnimeDrawerRefType = {
  setOpen: (open: boolean) => void;
};

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
  type: string;
  status: string;
  rank: number;
  mean: number;
  popularity: number;
  stats: StatsStatus;
  episodeCount: number;
  episodeDuration: string;
  season: string;
  seasonYear: number;
  broadcastDay: string;
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

interface Related {
  id: number;
  title: string;
  picture: string;
  relation: string;
}

export const defaultAnimeDrawer: AnimeDrawerType = {
  id: 0,
  title: "",
  titleSynonyms: [],
  titleEnglish: "",
  titleJapanese: "",
  pictures: [],
  synopsis: "",
  startDate: "",
  endDate: "",
  type: "",
  status: "",
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
  episodeDuration: "",
  season: "",
  seasonYear: 0,
  broadcastDay: "",
  broadcastTime: "",
  genres: [],
  related: [],
  extendedRelated: [],
};
