export const AnimeType = {
  tv: 'TV',
  ova: 'OVA',
  ona: 'ONA',
  movie: 'MOVIE',
  special: 'SPECIAL',
  music: 'MUSIC',
};

export const AnimeTypeToStr = (type: string): string => {
  switch (type) {
    case AnimeType.tv:
      return 'TV';
    case AnimeType.ova:
      return 'OVA';
    case AnimeType.ona:
      return 'ONA';
    case AnimeType.movie:
      return 'Movie';
    case AnimeType.special:
      return 'Special';
    case AnimeType.music:
      return 'Music';
    default:
      return '-';
  }
};

export const AnimeStatus = {
  finished: 'FINISHED',
  releasing: 'RELEASING',
  not_yet: 'NOT_YET',
};

export const AnimeStatusToStr = (status: string): string => {
  switch (status) {
    case AnimeStatus.finished:
      return 'Finished';
    case AnimeStatus.releasing:
      return 'Airing';
    case AnimeStatus.not_yet:
      return 'Not yet aired';
    default:
      return '-';
  }
};

export const UserAnimeStatus = {
  watching: 'WATCHING',
  completed: 'COMPLETED',
  on_hold: 'ON_HOLD',
  dropped: 'DROPPED',
  planned: 'PLANNED',
};

export const AnimeRelation = {
  sequel: 'SEQUEL',
  prequel: 'PREQUEL',
  alternative_setting: 'ALTERNATIVE_SETTING',
  alternative_version: 'ALTERNATIVE_VERSION',
  side_story: 'SIDE_STORY',
  parent_story: 'PARENT_STORY',
  summary: 'SUMMARY',
  full_story: 'FULL_STORY',
  spin_off: 'SPIN_OFF',
  adaptation: 'ADAPTATION',
  character: 'CHARACTER',
  other: 'OTHER',
};
