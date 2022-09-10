# Sekai

<p align="center">
    <img src="https://raw.githubusercontent.com/rl404/sekai/master/public/images/main.jpg"><br>
    <a href='https://github.com/rl404/sekai/blob/master/gallery.md'><i>see more pictures</i></a>
</p>

_Sekai_ is a website where you can see your anime world. How your anime relates with each other. Anime list data is taken from your [MyAnimeList](https://myanimelist.net/)'s anime list. So, make sure you have some anime in your anime list. Or you can see other people anime list.

Powered by my [akatsuki](https://github.com/rl404/akatsuki) as backend.


## Features

- Convert your anime list to [force-directed graph](https://en.wikipedia.org/wiki/Force-directed_graph_drawing).
- Configurable graph.
  - Search node by anime title.
  - Node color by status.
  - Show anime detail on click.
  - Show anime title on graph.
  - Show extended anime relation on hover.
- Show anime details.
- Show anime list in table.
  - Filterable.
    - Title.
    - Already in your list or not.
    - Airing status.
    - Type.
    - Your status.
  - Sortable.
    - Title.
    - Airing status.
    - Average score.
    - Type.
    - Your status.
    - Your score.
- Show your anime stats.
  - Total anime count.
    - By status.
    - By type.
    - By source.
    - By year and score.
    - By season.
    - By episode count and score.
    - By episode duration and score.
- Show your anime recommendations with score filter.
  - Sequel or prequel.
  - Side story or alternative story.
  - On hold.
  - Planned and already aired.
  - Summary and Full story.
  - Other relation.
  - Mismatched episode count.

_More will be coming soon..._

## Requirement

- [NodeJS](https://nodejs.org/)
- Backend API ([akatsuki](https://github.com/rl404/akatsuki))

## Installation

1. Clone the repo.
```sh
git clone https://github.com/rl404/sekai
```
2. Rename `.env.sample` to `.env` and modify the value according to your setup.
3. Install depedencies.
```sh
npm ci
```
4. Start.
```sh
npm run dev
```
5. [http://localhost:3000](http://localhost:3000) is ready.

## Disclaimer

_Sekai_ is meant for educational purpose and personal usage only. Please use it responsibly according to MyAnimeList's [Terms Of Service](https://myanimelist.net/about/terms_of_use).

All data belong to their respective copyrights owners, _sekai_ does not have any affiliation with content providers.

## License

MIT License

Copyright (c) 2022 Axel