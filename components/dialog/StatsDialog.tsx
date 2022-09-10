import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { GraphNode } from '../../types/Types';
import CloseIcon from '@mui/icons-material/Close';
import SlideTransition from '../transition/SlideTransition';
import {
  AnimeSource,
  AnimeSourceToStr,
  AnimeType,
  AnimeTypeToStr,
  SeasonToStr,
  UserAnimeStatus,
  UserAnimeStatusStr,
} from '../../utils/constant';
import BarChart from '../chart/BarChart';
import { theme } from '../theme';
import RadarChart from '../chart/RadarChart';
import BarLineChart from '../chart/BarLineChart';
import ScatterChart from '../chart/ScatterChart';
import PieChart from '../chart/PieChart';

const StatsDialog = ({
  open,
  onClose,
  username,
  nodes = [],
  nodeColor,
}: {
  open: boolean;
  onClose: () => void;
  username: string;
  nodes: Array<GraphNode>;
  nodeColor: any;
}) => {
  const inList = nodes.filter((n) => n.user_anime_status !== '');
  const nonZeroScore = nodes.filter((n) => n.user_anime_score !== 0);

  const byType: { [type: string]: number } = {
    [AnimeType.tv]: 0,
    [AnimeType.ova]: 0,
    [AnimeType.ona]: 0,
    [AnimeType.movie]: 0,
    [AnimeType.special]: 0,
    [AnimeType.music]: 0,
  };

  const bySource: { [type: string]: number } = {
    [AnimeSource.original]: 0,
    [AnimeSource.manga]: 0,
    [AnimeSource.koma_4_manga]: 0,
    [AnimeSource.web_manga]: 0,
    [AnimeSource.digital_manga]: 0,
    [AnimeSource.novel]: 0,
    [AnimeSource.light_novel]: 0,
    [AnimeSource.visual_novel]: 0,
    [AnimeSource.game]: 0,
    [AnimeSource.card_game]: 0,
    [AnimeSource.book]: 0,
    [AnimeSource.picture_book]: 0,
    [AnimeSource.radio]: 0,
    [AnimeSource.music]: 0,
    [AnimeSource.other]: 0,
    [AnimeSource.web_novel]: 0,
    [AnimeSource.mixed_media]: 0,
  };

  const byStatus: { [type: string]: number } = {
    [UserAnimeStatus.watching]: 0,
    [UserAnimeStatus.completed]: 0,
    [UserAnimeStatus.on_hold]: 0,
    [UserAnimeStatus.dropped]: 0,
    [UserAnimeStatus.planned]: 0,
  };

  const byEpisodeCount: {
    [type: string]: {
      count: number;
      globalSumScore: number;
      globalCountScore: number;
      sumScore: number;
      countScore: number;
    };
  } = {
    '1': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '2-6': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '7-13': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '14-26': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '27-52': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '53-100': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '101+': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '?': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
  };

  const byEpisodeDuration: {
    [type: string]: {
      count: number;
      globalSumScore: number;
      globalCountScore: number;
      sumScore: number;
      countScore: number;
    };
  } = {
    '< 1': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '1-5': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '6-10': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '11-15': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '15-30': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '31-60': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '61-120': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '121+': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
    '?': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 },
  };

  const bySeason: { [season: string]: number } = {};
  const byYear: {
    [year: string]: {
      count: number;
      globalSumScore: number;
      globalCountScore: number;
      sumScore: number;
      countScore: number;
    };
  } = {};

  var minYear = -1;
  var maxYear = new Date().getFullYear();

  nodes
    .filter((n) => n.user_anime_status !== '' && n.type !== '')
    .forEach((n) => {
      byType[n.type]++;
      byStatus[n.user_anime_status]++;
      n.source && bySource[n.source]++;

      var episodeCountKey = '?';
      if (n.episode_count === 1) episodeCountKey = '1';
      if (n.episode_count >= 2 && n.episode_count <= 6) episodeCountKey = '2-6';
      if (n.episode_count >= 7 && n.episode_count <= 13) episodeCountKey = '7-13';
      if (n.episode_count >= 14 && n.episode_count <= 26) episodeCountKey = '14-26';
      if (n.episode_count >= 27 && n.episode_count <= 52) episodeCountKey = '27-52';
      if (n.episode_count >= 53 && n.episode_count <= 100) episodeCountKey = '53-100';
      if (n.episode_count >= 101) episodeCountKey = '101+';

      byEpisodeCount[episodeCountKey].count++;
      n.user_anime_score > 0 && (byEpisodeCount[episodeCountKey].sumScore += n.user_anime_score);
      n.user_anime_score > 0 && byEpisodeCount[episodeCountKey].countScore++;
      n.score > 0 && (byEpisodeCount[episodeCountKey].globalSumScore += n.score);
      n.score > 0 && byEpisodeCount[episodeCountKey].globalCountScore++;

      var episodeDurationKey = '?';
      if (n.episode_duration > 0) {
        const dur = n.episode_duration / 60;
        if (dur < 1) episodeDurationKey = '< 1';
        if (dur >= 1 && dur <= 5) episodeDurationKey = '1-5';
        if (dur >= 6 && dur <= 10) episodeDurationKey = '6-10';
        if (dur >= 11 && dur <= 15) episodeDurationKey = '11-15';
        if (dur >= 15 && dur <= 30) episodeDurationKey = '15-30';
        if (dur >= 31 && dur <= 60) episodeDurationKey = '31-60';
        if (dur >= 61 && dur <= 120) episodeDurationKey = '61-120';
        if (dur >= 121) episodeDurationKey = '121+';
      }

      byEpisodeDuration[episodeDurationKey].count++;
      n.user_anime_score > 0 && (byEpisodeDuration[episodeDurationKey].sumScore += n.user_anime_score);
      n.user_anime_score > 0 && byEpisodeDuration[episodeDurationKey].countScore++;
      n.score > 0 && (byEpisodeDuration[episodeDurationKey].globalSumScore += n.score);
      n.score > 0 && byEpisodeDuration[episodeDurationKey].globalCountScore++;

      if (n.season !== '') {
        const seasonYearKey = n.season + '-' + n.season_year;
        !bySeason[seasonYearKey] && (bySeason[seasonYearKey] = 0);
        bySeason[seasonYearKey]++;
      }

      if (n.start_year > 0) {
        if (minYear == -1 || n.start_year < minYear) minYear = n.start_year;
        if (n.start_year > maxYear) maxYear = n.start_year;

        const year = n.start_year.toString();
        !byYear[year] &&
          (byYear[year] = { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 });
        byYear[year].count++;
        n.user_anime_score > 0 && (byYear[year].sumScore += n.user_anime_score);
        n.user_anime_score > 0 && byYear[year].countScore++;
        n.score > 0 && (byYear[year].globalSumScore += n.score);
        n.score > 0 && byYear[year].globalCountScore++;
      }
    });

  // Fill missing year.
  for (var i = minYear; i <= maxYear; i++) {
    const year = i.toString();
    if (!byYear[year]) {
      byYear[year] = { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0 };
    }
  }

  return (
    <Dialog
      open={open}
      fullScreen
      TransitionComponent={SlideTransition}
      PaperProps={{
        style: {
          backgroundImage: 'radial-gradient(rgb(65, 65, 65) 0.5px, #121212 0.5px)',
          backgroundSize: '15px 15px',
        },
      }}
    >
      <DialogTitle>
        <Grid container>
          <Grid item>{`${username}'s Stats`}</Grid>
          <Grid item xs />
          <Grid item>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <StatsCard title="Total Anime" value={inList.length.toLocaleString()} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatsCard
              title="Average Score"
              value={(
                nonZeroScore.reduce((total, next) => total + next.user_anime_score, 0) / nonZeroScore.length
              ).toFixed(2)}
              tooltip={`from ${nonZeroScore.length.toLocaleString()} rated anime`}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatsCard
              title="Total Episodes"
              value={nodes.reduce((total, next) => total + next.user_episode_count, 0).toLocaleString()}
              tooltip="sum of watched episodes"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatsCard
              title="Total Duration (days)"
              value={(
                nodes.reduce((total, next) => total + next.user_episode_count * next.episode_duration, 0) /
                (60 * 60 * 24)
              )
                .toFixed(2)
                .toLocaleString()}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartCard title="Anime by Status">
              <BarChart
                config={{ valueName: 'count' }}
                data={Object.keys(byStatus).map((k) => {
                  return {
                    label: UserAnimeStatusStr(k),
                    value: byStatus[k],
                    color: nodeColor[k],
                  };
                })}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ChartCard title="Anime by Type">
              <RadarChart
                config={{ valueName: 'count' }}
                data={Object.keys(byType)
                  .map((k) => {
                    return { label: AnimeTypeToStr(k), value: byType[k] };
                  })
                  .sort((a, b) => b.value - a.value)}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ChartCard title="Anime by Source">
              <PieChart
                config={{ valueName: 'count' }}
                data={Object.keys(bySource)
                  .map((k) => {
                    return { label: AnimeSourceToStr(k), value: bySource[k] };
                  })
                  .sort((a, b) => b.value - a.value)}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartCard title="Anime by Episode Count & Score">
              <BarLineChart
                config={{ valueBarName: 'count', valueLine1Name: 'user score', valueLine2Name: 'global score' }}
                data={Object.keys(byEpisodeCount).map((k) => {
                  return {
                    label: k,
                    valueBar: byEpisodeCount[k].count,
                    valueLine1: byEpisodeCount[k].sumScore / byEpisodeCount[k].countScore,
                    valueLine2: byEpisodeCount[k].globalSumScore / byEpisodeCount[k].globalCountScore,
                  };
                })}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartCard title="Anime by Episode Duration (minutes) & Score">
              <BarLineChart
                config={{ valueBarName: 'count', valueLine1Name: 'user score', valueLine2Name: 'global score' }}
                data={Object.keys(byEpisodeDuration).map((k) => {
                  return {
                    label: k,
                    valueBar: byEpisodeDuration[k].count,
                    valueLine1: byEpisodeDuration[k].sumScore / byEpisodeDuration[k].countScore,
                    valueLine2: byEpisodeDuration[k].globalSumScore / byEpisodeDuration[k].globalCountScore,
                  };
                })}
              />
            </ChartCard>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <ChartCard title="Anime by Year & Score">
              <BarLineChart
                config={{
                  valueBarName: 'count',
                  valueLine1Name: 'user score',
                  valueLine2Name: 'global score',
                  useBrush: true,
                  brushIndex: Object.keys(byYear).length > 10 ? Object.keys(byYear).length - 10 : 0,
                }}
                data={Object.keys(byYear).map((k) => {
                  return {
                    label: k,
                    valueBar: byYear[k].count,
                    valueLine1: byYear[k].sumScore / byYear[k].countScore,
                    valueLine2: byYear[k].globalSumScore / byYear[k].globalCountScore,
                  };
                })}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <ChartCard title="Anime by Season & Year">
              <ScatterChart
                config={{ xName: 'year', yName: 'season', zName: 'count' }}
                data={Object.keys(bySeason).map((k) => {
                  const seasonYear = k.split('-');
                  return {
                    x: parseInt(seasonYear[1], 10),
                    y: SeasonToStr(seasonYear[0]),
                    z: bySeason[k],
                  };
                })}
              />
            </ChartCard>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StatsDialog;

const style = {
  statsTitle: {
    color: theme.palette.grey[500],
  },
};

const StatsCard = ({ title, value, tooltip = '' }: { title: string; value: string; tooltip?: string }) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography gutterBottom sx={style.statsTitle}>
          {title}
        </Typography>
        <Tooltip title={tooltip} placement="bottom" arrow>
          <Typography variant="h3">{value}</Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', height: 300 }}>
        <Typography gutterBottom sx={style.statsTitle}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};
