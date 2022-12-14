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

export const Season = {
  winter: 'WINTER',
  spring: 'SPRING',
  summer: 'SUMMER',
  fall: 'FALL',
};

export const SeasonToStr = (season: string): string => {
  switch (season) {
    case Season.winter:
      return 'Winter';
    case Season.spring:
      return 'Spring';
    case Season.summer:
      return 'Summer';
    case Season.fall:
      return 'Fall';
    default:
      return '';
  }
};

export const Day = {
  monday: 'MONDAY',
  tuesday: 'TUESDAY',
  wednesday: 'WEDNESDAY',
  thursday: 'THURSDAY',
  friday: 'FRIDAY',
  saturday: 'SATURDAY',
  sunday: 'SUNDAY',
  other: 'OTHER',
};

export const DayToStr = (day: string): string => {
  switch (day) {
    case Day.monday:
      return 'Monday';
    case Day.tuesday:
      return 'Tuesday';
    case Day.wednesday:
      return 'Wednesday';
    case Day.thursday:
      return 'Thursday';
    case Day.friday:
      return 'Friday';
    case Day.saturday:
      return 'Saturday';
    case Day.sunday:
      return 'Sunday';
    case Day.other:
      return 'Other';
    default:
      return '';
  }
};

export const AnimeSource = {
  original: 'ORIGINAL',
  manga: 'MANGA',
  koma_4_manga: '4_KOMA_MANGA',
  web_manga: 'WEB_MANGA',
  digital_manga: 'DIGITAL_MANGA',
  novel: 'NOVEL',
  light_novel: 'LIGHT_NOVEL',
  visual_novel: 'VISUAL_NOVEL',
  game: 'GAME',
  card_game: 'CARD_GAME',
  book: 'BOOK',
  picture_book: 'PICTURE_BOOK',
  radio: 'RADIO',
  music: 'MUSIC',
  other: 'OTHER',
  web_novel: 'WEB_NOVEL',
  mixed_media: 'MIXED_MEDIA',
};

export const AnimeSourceToStr = (source: string): string => {
  switch (source) {
    case AnimeSource.original:
      return 'Original';
    case AnimeSource.manga:
      return 'Manga';
    case AnimeSource.koma_4_manga:
      return '4 Koma Manga';
    case AnimeSource.web_manga:
      return 'Web Manga';
    case AnimeSource.digital_manga:
      return 'Digital Manga';
    case AnimeSource.novel:
      return 'Novel';
    case AnimeSource.light_novel:
      return 'Light Novel';
    case AnimeSource.visual_novel:
      return 'Visual Novel';
    case AnimeSource.game:
      return 'Game';
    case AnimeSource.card_game:
      return 'Card Game';
    case AnimeSource.book:
      return 'Book';
    case AnimeSource.picture_book:
      return 'Picture Book';
    case AnimeSource.radio:
      return 'Radio';
    case AnimeSource.music:
      return 'Music';
    case AnimeSource.other:
      return 'Other';
    case AnimeSource.web_novel:
      return 'Web Novel';
    case AnimeSource.mixed_media:
      return 'Mixed Media';
    default:
      return '';
  }
};
