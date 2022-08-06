const animeKey = (id: Number) => `anime-${id}`;
const userAnimeKey = (username: string) => `user-anime-${username}`;
const userAnimeRelationKey = (username: string) => `user-name-relation-${username}`;

export const deleteStorage = () => {
  localStorage.clear();
};

export const saveUserAnime = (username: string, list: Array<any>) => {
  localStorage.setItem(userAnimeKey(username), JSON.stringify(list));
};

export const getUserAnime = (username: string) => {
  var userAnime = localStorage.getItem(userAnimeKey(username));
  if (!userAnime) {
    return undefined;
  }
  return JSON.parse(userAnime);
};

export const deleteUserAnime = (username: string) => {
  localStorage.removeItem(userAnimeKey(username));
};

export const saveAnime = (id: Number, data: any) => {
  localStorage.setItem(animeKey(id), JSON.stringify(data));
};

export const getAnime = (id: Number) => {
  var anime = localStorage.getItem(animeKey(id));
  if (!anime) {
    return undefined;
  }
  return JSON.parse(anime);
};

export const deleteAnime = (id: Number) => {
  localStorage.removeItem(animeKey(id));
};

export const saveUserAnimeRelation = (username: string, data: any) => {
  localStorage.setItem(userAnimeRelationKey(username), JSON.stringify(data));
};

export const getUserAnimeRelation = (username: string) => {
  var relation = localStorage.getItem(userAnimeRelationKey(username));
  if (!relation) {
    return undefined;
  }
  return JSON.parse(relation);
};

export const deleteUserAnimeRelation = (username: string) => {
  localStorage.removeItem(userAnimeRelationKey(username));
};
