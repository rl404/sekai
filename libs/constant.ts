export const AnimeType = {
  tv: "TV",
  ova: "OVA",
  ona: "ONA",
  movie: "MOVIE",
  special: "SPECIAL",
  music: "MUSIC",
};

export const AnimeTypeToStr = (type: string): string => {
  switch (type) {
    case AnimeType.tv:
      return "TV";
    case AnimeType.ova:
      return "OVA";
    case AnimeType.ona:
      return "ONA";
    case AnimeType.movie:
      return "Movie";
    case AnimeType.special:
      return "Special";
    case AnimeType.music:
      return "Music";
    default:
      return "-";
  }
};

export const AnimeStatus = {
  finished: "FINISHED",
  releasing: "RELEASING",
  notYet: "NOT_YET",
};

export const AnimeStatusToStr = (status: string): string => {
  switch (status) {
    case AnimeStatus.finished:
      return "Finished";
    case AnimeStatus.releasing:
      return "Airing";
    case AnimeStatus.notYet:
      return "Not yet aired";
    default:
      return "-";
  }
};

export const UserAnimeStatus = {
  watching: "WATCHING",
  completed: "COMPLETED",
  onHold: "ON_HOLD",
  dropped: "DROPPED",
  planned: "PLANNED",
};

export const UserAnimeStatusStr = (status: string): string => {
  switch (status) {
    case UserAnimeStatus.watching:
      return "Watching";
    case UserAnimeStatus.completed:
      return "Completed";
    case UserAnimeStatus.onHold:
      return "On Hold";
    case UserAnimeStatus.dropped:
      return "Dropped";
    case UserAnimeStatus.planned:
      return "Planned";
    default:
      return "";
  }
};

export const AnimeRelation = {
  sequel: "SEQUEL",
  prequel: "PREQUEL",
  alternativeSetting: "ALTERNATIVE_SETTING",
  alternativeVersion: "ALTERNATIVE_VERSION",
  sideStory: "SIDE_STORY",
  parentStory: "PARENT_STORY",
  summary: "SUMMARY",
  fullStory: "FULL_STORY",
  spinOff: "SPIN_OFF",
  adaptation: "ADAPTATION",
  character: "CHARACTER",
  other: "OTHER",
};

export const AnimeRelationToStr = (relation: string): string => {
  switch (relation) {
    case AnimeRelation.sequel:
      return "Sequel";
    case AnimeRelation.prequel:
      return "Prequel";
    case AnimeRelation.alternativeSetting:
      return "Alternative Setting";
    case AnimeRelation.alternativeVersion:
      return "Alternative Version";
    case AnimeRelation.sideStory:
      return "Side Story";
    case AnimeRelation.parentStory:
      return "Parent Story";
    case AnimeRelation.summary:
      return "Summary";
    case AnimeRelation.fullStory:
      return "Full Story";
    case AnimeRelation.spinOff:
      return "Spin Off";
    case AnimeRelation.adaptation:
      return "Adaptation";
    case AnimeRelation.character:
      return "Character";
    case AnimeRelation.other:
      return "Other";
    default:
      return "Unknown";
  }
};

export const Season = {
  winter: "WINTER",
  spring: "SPRING",
  summer: "SUMMER",
  fall: "FALL",
};

export const SeasonToStr = (season: string): string => {
  switch (season) {
    case Season.winter:
      return "Winter";
    case Season.spring:
      return "Spring";
    case Season.summer:
      return "Summer";
    case Season.fall:
      return "Fall";
    default:
      return "";
  }
};

export const Day = {
  monday: "MONDAY",
  tuesday: "TUESDAY",
  wednesday: "WEDNESDAY",
  thursday: "THURSDAY",
  friday: "FRIDAY",
  saturday: "SATURDAY",
  sunday: "SUNDAY",
  other: "OTHER",
};

export const DayToStr = (day: string): string => {
  switch (day) {
    case Day.monday:
      return "Monday";
    case Day.tuesday:
      return "Tuesday";
    case Day.wednesday:
      return "Wednesday";
    case Day.thursday:
      return "Thursday";
    case Day.friday:
      return "Friday";
    case Day.saturday:
      return "Saturday";
    case Day.sunday:
      return "Sunday";
    case Day.other:
      return "Other";
    default:
      return "";
  }
};

export const AnimeSource = {
  original: "ORIGINAL",
  manga: "MANGA",
  koma4Manga: "4_KOMA_MANGA",
  webManga: "WEB_MANGA",
  digitalManga: "DIGITAL_MANGA",
  novel: "NOVEL",
  lightNovel: "LIGHT_NOVEL",
  visualNovel: "VISUAL_NOVEL",
  game: "GAME",
  cardGame: "CARD_GAME",
  book: "BOOK",
  pictureBook: "PICTURE_BOOK",
  radio: "RADIO",
  music: "MUSIC",
  other: "OTHER",
  webNovel: "WEB_NOVEL",
  mixedMedia: "MIXED_MEDIA",
};

export const AnimeSourceToStr = (source: string): string => {
  switch (source) {
    case AnimeSource.original:
      return "Original";
    case AnimeSource.manga:
      return "Manga";
    case AnimeSource.koma4Manga:
      return "4 Koma Manga";
    case AnimeSource.webManga:
      return "Web Manga";
    case AnimeSource.digitalManga:
      return "Digital Manga";
    case AnimeSource.novel:
      return "Novel";
    case AnimeSource.lightNovel:
      return "Light Novel";
    case AnimeSource.visualNovel:
      return "Visual Novel";
    case AnimeSource.game:
      return "Game";
    case AnimeSource.cardGame:
      return "Card Game";
    case AnimeSource.book:
      return "Book";
    case AnimeSource.pictureBook:
      return "Picture Book";
    case AnimeSource.radio:
      return "Radio";
    case AnimeSource.music:
      return "Music";
    case AnimeSource.other:
      return "Other";
    case AnimeSource.webNovel:
      return "Web Novel";
    case AnimeSource.mixedMedia:
      return "Mixed Media";
    default:
      return "";
  }
};
