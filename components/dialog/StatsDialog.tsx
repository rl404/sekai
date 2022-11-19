import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { AnimeDrawerState, GraphNode } from '../../types/Types';
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
import MiniBarChart from '../chart/MiniBarChart';
import MiniAreaChart from '../chart/MiniAreaChart';
import AnimeDrawer from '../drawer/AnimeDrawer';
import StatusCircle from '../circle/StatusCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
  const [animeDrawerState, setAnimeDrawerState] = React.useState<AnimeDrawerState>({
    open: false,
    anime_id: 0,
  });

  const handleCloseAnimeDrawer = () => {
    setAnimeDrawerState({ open: false, anime_id: 0 });
  };

  const handleOpenAnimeDrawer = (anime_id: number) => {
    setAnimeDrawerState({ open: true, anime_id: anime_id });
  };

  const inList = nodes.filter((n) => n.user_anime_status !== '');
  const nonZeroScore = nodes.filter((n) => n.user_anime_score !== 0);
  const avgScore = nonZeroScore.reduce((total, next) => total + next.user_anime_score, 0) / nonZeroScore.length;
  const globalNonZeroScore = inList.filter((n) => n.score > 0);
  const globalAvgScore = globalNonZeroScore.reduce((total, next) => total + next.score, 0) / globalNonZeroScore.length;

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
      nodes: Array<GraphNode>;
    };
  } = {
    '1': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '2-6': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '7-13': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '14-26': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '27-52': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '53-100': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '101+': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '?': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
  };

  const byEpisodeDuration: {
    [type: string]: {
      count: number;
      globalSumScore: number;
      globalCountScore: number;
      sumScore: number;
      countScore: number;
      nodes: Array<GraphNode>;
    };
  } = {
    '< 1': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '1-5': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '6-10': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '11-15': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '16-30': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '31-60': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '61-120': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '121+': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
    '?': { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
  };

  const bySeason: { [season: string]: number } = {};
  const byYear: {
    [year: string]: {
      count: number;
      globalSumScore: number;
      globalCountScore: number;
      sumScore: number;
      countScore: number;
      nodes: Array<GraphNode>;
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
      if (n.episode_count >= 2 && n.episode_count < 7) episodeCountKey = '2-6';
      if (n.episode_count >= 7 && n.episode_count < 14) episodeCountKey = '7-13';
      if (n.episode_count >= 14 && n.episode_count < 27) episodeCountKey = '14-26';
      if (n.episode_count >= 27 && n.episode_count < 53) episodeCountKey = '27-52';
      if (n.episode_count >= 53 && n.episode_count < 101) episodeCountKey = '53-100';
      if (n.episode_count >= 101) episodeCountKey = '101+';

      byEpisodeCount[episodeCountKey].count++;
      byEpisodeCount[episodeCountKey].nodes.push(n);
      n.user_anime_score > 0 && (byEpisodeCount[episodeCountKey].sumScore += n.user_anime_score);
      n.user_anime_score > 0 && byEpisodeCount[episodeCountKey].countScore++;
      n.score > 0 && (byEpisodeCount[episodeCountKey].globalSumScore += n.score);
      n.score > 0 && byEpisodeCount[episodeCountKey].globalCountScore++;

      var episodeDurationKey = '?';
      if (n.episode_duration > 0) {
        const dur = n.episode_duration / 60;
        if (dur < 1) episodeDurationKey = '< 1';
        if (dur >= 1 && dur < 6) episodeDurationKey = '1-5';
        if (dur >= 6 && dur < 11) episodeDurationKey = '6-10';
        if (dur >= 11 && dur < 16) episodeDurationKey = '11-15';
        if (dur >= 16 && dur < 31) episodeDurationKey = '16-30';
        if (dur >= 31 && dur < 61) episodeDurationKey = '31-60';
        if (dur >= 61 && dur < 121) episodeDurationKey = '61-120';
        if (dur >= 121) episodeDurationKey = '121+';
      }

      byEpisodeDuration[episodeDurationKey].count++;
      byEpisodeDuration[episodeDurationKey].nodes.push(n);
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
          (byYear[year] = { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] });
        byYear[year].count++;
        byYear[year].nodes.push(n);
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
      byYear[year] = { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] };
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
            <StatsCard
              title="Total Anime"
              value={inList.length.toLocaleString()}
              tooltip={`${nonZeroScore.length.toLocaleString()} rated anime`}
              chart={
                <MiniBarChart
                  data={Object.keys(byYear)
                    .map((k) => {
                      return {
                        label: k,
                        value: byYear[k].count,
                        color: nodeColor[k],
                      };
                    })
                    .filter((d) => d.value > 0)}
                />
              }
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatsCard
              title="Average Score"
              value={avgScore.toFixed(2)}
              tooltip={
                <>
                  {globalAvgScore.toFixed(2)} average global score{' '}
                  <span style={avgScore > globalAvgScore ? style.scoreGreen : style.scoreRed}>
                    ({avgScore > globalAvgScore ? '+' : ''}
                    {(avgScore - globalAvgScore).toFixed(2)})
                  </span>
                </>
              }
              chart={
                <MiniAreaChart
                  data={Object.keys(byYear)
                    .map((k) => {
                      return {
                        label: k,
                        value: byYear[k].sumScore / byYear[k].countScore,
                        color: nodeColor[k],
                      };
                    })
                    .filter((d) => d.value > 0)}
                />
              }
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatsCard
              title="Total Episodes"
              value={nodes.reduce((total, next) => total + next.user_episode_count, 0).toLocaleString()}
              tooltip="sum of watched episodes"
              chart={
                <MiniAreaChart
                  data={Object.keys(byEpisodeCount)
                    .map((k) => {
                      return {
                        label: k,
                        value: byEpisodeCount[k].sumScore / byEpisodeCount[k].countScore,
                        color: nodeColor[k],
                      };
                    })
                    .filter((d) => d.value > 0)}
                />
              }
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
              chart={
                <MiniAreaChart
                  data={Object.keys(byEpisodeDuration)
                    .map((k) => {
                      return {
                        label: k,
                        value: byEpisodeDuration[k].sumScore / byEpisodeDuration[k].countScore,
                        color: nodeColor[k],
                      };
                    })
                    .filter((d) => d.value > 0)}
                />
              }
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartCard title="Anime by Status">
              <BarChart
                config={{ valueName: 'count', nodeColor: nodeColor }}
                data={Object.keys(byStatus).map((k) => {
                  return {
                    label: UserAnimeStatusStr(k),
                    value: byStatus[k],
                    color: nodeColor[k],
                    nodes: nodes.filter((n) => n.user_anime_status === k),
                  };
                })}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ChartCard title="Anime by Type">
              <RadarChart
                config={{ valueName: 'count', nodeColor: nodeColor }}
                data={Object.keys(byType)
                  .map((k) => {
                    return {
                      label: AnimeTypeToStr(k),
                      value: byType[k],
                      nodes: nodes.filter((n) => n.user_anime_status !== '' && n.type == k),
                    };
                  })
                  .sort((a, b) => b.value - a.value)}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ChartCard title="Anime by Source">
              <PieChart
                config={{ valueName: 'count', nodeColor: nodeColor }}
                data={Object.keys(bySource)
                  .map((k) => {
                    return {
                      label: AnimeSourceToStr(k),
                      value: bySource[k],
                      nodes: nodes.filter((n) => n.user_anime_status !== '' && n.source == k),
                    };
                  })
                  .sort((a, b) => b.value - a.value)}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartCard title="Anime by Episode Count & Score">
              <BarLineChart
                config={{
                  valueBarName: 'count',
                  valueLine1Name: 'user score',
                  valueLine2Name: 'global score',
                  nodeColor: nodeColor,
                }}
                data={Object.keys(byEpisodeCount).map((k) => {
                  return {
                    label: k,
                    valueBar: byEpisodeCount[k].count,
                    valueLine1: byEpisodeCount[k].sumScore / byEpisodeCount[k].countScore,
                    valueLine2: byEpisodeCount[k].globalSumScore / byEpisodeCount[k].globalCountScore,
                    nodes: byEpisodeCount[k].nodes,
                  };
                })}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <ChartCard title="Anime by Episode Duration (minutes) & Score">
              <BarLineChart
                config={{
                  valueBarName: 'count',
                  valueLine1Name: 'user score',
                  valueLine2Name: 'global score',
                  nodeColor: nodeColor,
                }}
                data={Object.keys(byEpisodeDuration).map((k) => {
                  return {
                    label: k,
                    valueBar: byEpisodeDuration[k].count,
                    valueLine1: byEpisodeDuration[k].sumScore / byEpisodeDuration[k].countScore,
                    valueLine2: byEpisodeDuration[k].globalSumScore / byEpisodeDuration[k].globalCountScore,
                    nodes: byEpisodeDuration[k].nodes,
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
                  nodeColor: nodeColor,
                }}
                data={Object.keys(byYear).map((k) => {
                  return {
                    label: k,
                    valueBar: byYear[k].count,
                    valueLine1: byYear[k].sumScore / byYear[k].countScore,
                    valueLine2: byYear[k].globalSumScore / byYear[k].globalCountScore,
                    nodes: byYear[k].nodes,
                  };
                })}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6}>
            <ChartCard title="Anime by Season & Year">
              <ScatterChart
                config={{
                  xName: 'year',
                  yName: 'season',
                  zName: 'count',
                  nodeColor: nodeColor,
                }}
                data={Object.keys(bySeason).map((k) => {
                  const seasonYear = k.split('-');
                  return {
                    x: parseInt(seasonYear[1], 10),
                    y: SeasonToStr(seasonYear[0]),
                    z: bySeason[k],
                    nodes: nodes.filter((n) => n.user_anime_status !== '' && n.season + '-' + n.season_year == k),
                  };
                })}
              />
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <AnimeListCard
              title="Top Highest Score"
              valueFormatter={(n) => {
                return n.score.toFixed(2);
              }}
              nodes={Object.assign<GraphNode[], GraphNode[]>([], nodes).sort((a, b) => b.score - a.score)}
              nodeColor={nodeColor}
              showAnimeDrawer={handleOpenAnimeDrawer}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <AnimeListCard
              title="Most Episode Count"
              valueFormatter={(n) => {
                return n.episode_count.toLocaleString();
              }}
              nodes={Object.assign<GraphNode[], GraphNode[]>([], nodes).sort(
                (a, b) => b.episode_count - a.episode_count,
              )}
              nodeColor={nodeColor}
              showAnimeDrawer={handleOpenAnimeDrawer}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <AnimeListCard
              title="Longest Episode Duration (minutes)"
              valueFormatter={(n) => {
                return (n.episode_duration / 60).toFixed(0).toLocaleString();
              }}
              nodes={Object.assign<GraphNode[], GraphNode[]>([], nodes).sort(
                (a, b) => b.episode_duration - a.episode_duration,
              )}
              nodeColor={nodeColor}
              showAnimeDrawer={handleOpenAnimeDrawer}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <AnimeListCard
              title="Most Relation Count"
              valueFormatter={(n) => {
                return n.neighbors.length.toLocaleString();
              }}
              nodes={Object.assign<GraphNode[], GraphNode[]>([], nodes).sort(
                (a, b) => b.neighbors.length - a.neighbors.length,
              )}
              nodeColor={nodeColor}
              showAnimeDrawer={handleOpenAnimeDrawer}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <AnimeDrawer
        open={animeDrawerState.open}
        anime_id={animeDrawerState.anime_id}
        onClose={handleCloseAnimeDrawer}
        nodes={nodes}
        nodeColor={nodeColor}
      />
    </Dialog>
  );
};

export default StatsDialog;

const style = {
  statsTitle: {
    color: theme.palette.grey[500],
  },
  statsChart: {
    position: 'absolute' as 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  scoreGreen: {
    color: theme.palette.success.main,
  },
  scoreRed: {
    color: theme.palette.error.main,
  },
};

const StatsCard = ({
  title,
  value,
  tooltip = '',
  chart,
}: {
  title: string;
  value: string;
  tooltip?: NonNullable<React.ReactNode>;
  chart?: React.ReactNode;
}) => {
  return (
    <Card sx={{ position: 'relative' }}>
      {chart && <div style={style.statsChart}>{chart}</div>}
      <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
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

const AnimeListCard = ({
  title,
  valueFormatter,
  nodes,
  nodeColor,
  showAnimeDrawer,
}: {
  title: string;
  valueFormatter: (node: GraphNode) => string;
  nodes: Array<GraphNode>;
  nodeColor: any;
  showAnimeDrawer: (anime_id: number) => void;
}) => {
  const [inList, setInList] = React.useState(false);

  const toggleInList = () => {
    setInList(!inList);
  };

  const rowsPerPage = 10;
  const [page, setPage] = React.useState(0);

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  nodes = nodes
    .filter((n) => !inList || n.user_anime_status !== '')
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <CardContent>
        <Typography sx={{ ...style.statsTitle, textAlign: 'center', marginBottom: 1 }}>{title}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {nodes.map((n, i) => {
            return (
              <React.Fragment key={n.id}>
                <Grid item xs={1} sx={{ textAlign: 'right' }}>
                  {`${page * rowsPerPage + i + 1}.`}
                </Grid>
                <Grid item xs={1} sx={{ textAlign: 'center' }}>
                  <StatusCircle status={n.user_anime_status} color={nodeColor[n.user_anime_status] || 'black'} />
                </Grid>
                <Grid item xs={8} sx={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  <Link
                    color="inherit"
                    underline="hover"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => showAnimeDrawer(n.id)}
                  >
                    {n.title}
                  </Link>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  {valueFormatter(n)}
                </Grid>
              </React.Fragment>
            );
          })}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item>
              <Tooltip title={inList ? 'show in list only' : 'show all'} placement="right" arrow>
                <IconButton onClick={toggleInList} size="small">
                  {inList ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs />
            <Grid item>
              <IconButton onClick={handlePrevPage} size="small" disabled={page === 0}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={handleNextPage} size="small">
                <ChevronRightIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
