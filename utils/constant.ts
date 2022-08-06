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

export const AnimeStatusStr = (status: string): string => {
  switch (status) {
    case AnimeStatus.finished:
      return 'Finished';
    case AnimeStatus.releasing:
      return 'Airing';
    case AnimeStatus.not_yet:
      return 'Not yet aired';
    default:
      return '';
  }
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

export const UserAnimeStatusStr = (status: string): string => {
  switch (status) {
    case UserAnimeStatus.watching:
      return 'Watching';
    case UserAnimeStatus.completed:
      return 'Completed';
    case UserAnimeStatus.on_hold:
      return 'On Hold';
    case UserAnimeStatus.dropped:
      return 'Dropped';
    case UserAnimeStatus.planned:
      return 'Planned';
    default:
      return '';
  }
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

export const AnimeRelationToStr = (relation: string): string => {
  switch (relation) {
    case AnimeRelation.sequel:
      return 'Sequel';
    case AnimeRelation.prequel:
      return 'Prequel';
    case AnimeRelation.alternative_setting:
      return 'Alternative Setting';
    case AnimeRelation.alternative_version:
      return 'Alternative Version';
    case AnimeRelation.side_story:
      return 'Side Story';
    case AnimeRelation.parent_story:
      return 'Parent Story';
    case AnimeRelation.summary:
      return 'Summary';
    case AnimeRelation.full_story:
      return 'Full Story';
    case AnimeRelation.spin_off:
      return 'Spin Off';
    case AnimeRelation.adaptation:
      return 'Adaptation';
    case AnimeRelation.character:
      return 'Character';
    case AnimeRelation.other:
      return 'Other';
    default:
      return 'Unknown';
  }
};
