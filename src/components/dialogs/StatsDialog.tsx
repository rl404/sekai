import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Fragment, ReactNode, memo, useState } from 'react';
import BarChart from '@/src/components/charts/BarChart';
import BarLineChart from '@/src/components/charts/BarLineChart';
import MiniAreaChart from '@/src/components/charts/MiniAreaChart';
import MiniBarChart from '@/src/components/charts/MiniBarChart';
import PieChart from '@/src/components/charts/PieChart';
import RadarChart from '@/src/components/charts/RadarChart';
import ScatterChart from '@/src/components/charts/ScatterChart';
import StatusCircle from '@/src/components/circles/StatusCircle';
import { useCtx } from '@/src/components/context';
import { Node } from '@/src/components/graphs/types';
import theme from '@/src/components/theme';
import SlideTransition from '@/src/components/transitions/SliceTransition';
import {
  AnimeSource,
  AnimeSourceToStr,
  AnimeType,
  AnimeTypeToStr,
  Season,
  SeasonToStr,
  UserAnimeStatus,
  UserAnimeStatusStr,
} from '@/src/libs/constant';

const styles = {
  dialogPaper: {
    backgroundImage: 'radial-gradient(rgb(65, 65, 65) 0.5px, #121212 0.5px)',
    backgroundSize: '15px 15px',
  },
  statsTitle: {
    color: theme.palette.grey[500],
  },
  statsChart: {
    position: 'absolute',
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

const StatsDialog = memo(function StatsDialog({ open, toggleOpen }: { open: boolean; toggleOpen: () => void }) {
  const ctx = useCtx();

  const inList = ctx.graphData.nodes.filter((n) => n.userAnimeStatus !== UserAnimeStatus['']);
  const nonZeroScore = ctx.graphData.nodes.filter((n) => n.userAnimeScore !== 0);
  const avgScore = nonZeroScore.reduce((total, next) => total + next.userAnimeScore, 0) / nonZeroScore.length;
  const globalNonZeroScore = inList.filter((n) => n.score > 0);
  const globalAvgScore = globalNonZeroScore.reduce((total, next) => total + next.score, 0) / globalNonZeroScore.length;

  const byType: { [type: string]: number } = {
    [AnimeType.tv]: 0,
    [AnimeType.ova]: 0,
    [AnimeType.ona]: 0,
    [AnimeType.movie]: 0,
    [AnimeType.special]: 0,
    [AnimeType.music]: 0,
    [AnimeType.cm]: 0,
    [AnimeType.pv]: 0,
    [AnimeType.tvSpecial]: 0,
  };

  const bySource: { [type: string]: number } = {
    [AnimeSource.original]: 0,
    [AnimeSource.manga]: 0,
    [AnimeSource.koma4Manga]: 0,
    [AnimeSource.webManga]: 0,
    [AnimeSource.digitalManga]: 0,
    [AnimeSource.novel]: 0,
    [AnimeSource.lightNovel]: 0,
    [AnimeSource.visualNovel]: 0,
    [AnimeSource.game]: 0,
    [AnimeSource.cardGame]: 0,
    [AnimeSource.book]: 0,
    [AnimeSource.pictureBook]: 0,
    [AnimeSource.radio]: 0,
    [AnimeSource.music]: 0,
    [AnimeSource.other]: 0,
    [AnimeSource.webNovel]: 0,
    [AnimeSource.mixedMedia]: 0,
  };

  const byStatus: { [type: string]: number } = {
    [UserAnimeStatus.watching]: 0,
    [UserAnimeStatus.completed]: 0,
    [UserAnimeStatus.onHold]: 0,
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
      nodes: Node[];
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
      nodes: Node[];
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
      nodes: Node[];
    };
  } = {};

  let minYear = -1;
  let maxYear = new Date().getFullYear();

  inList.forEach((n) => {
    byType[n.type]++;
    byStatus[n.userAnimeStatus]++;
    if (n.source) bySource[n.source]++;

    let episodeCountKey = '?';
    if (n.episodeCount === 1) episodeCountKey = '1';
    if (n.episodeCount >= 2 && n.episodeCount < 7) episodeCountKey = '2-6';
    if (n.episodeCount >= 7 && n.episodeCount < 14) episodeCountKey = '7-13';
    if (n.episodeCount >= 14 && n.episodeCount < 27) episodeCountKey = '14-26';
    if (n.episodeCount >= 27 && n.episodeCount < 53) episodeCountKey = '27-52';
    if (n.episodeCount >= 53 && n.episodeCount < 101) episodeCountKey = '53-100';
    if (n.episodeCount >= 101) episodeCountKey = '101+';

    byEpisodeCount[episodeCountKey].count++;
    byEpisodeCount[episodeCountKey].nodes.push(n);
    if (n.userAnimeScore > 0) byEpisodeCount[episodeCountKey].sumScore += n.userAnimeScore;
    if (n.userAnimeScore > 0) byEpisodeCount[episodeCountKey].countScore++;
    if (n.score > 0) byEpisodeCount[episodeCountKey].globalSumScore += n.score;
    if (n.score > 0) byEpisodeCount[episodeCountKey].globalCountScore++;

    let episodeDurationKey = '?';
    if (n.episodeDuration > 0) {
      const dur = n.episodeDuration / 60;
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
    if (n.userAnimeScore > 0) byEpisodeDuration[episodeDurationKey].sumScore += n.userAnimeScore;
    if (n.userAnimeScore > 0) byEpisodeDuration[episodeDurationKey].countScore++;
    if (n.score > 0) byEpisodeDuration[episodeDurationKey].globalSumScore += n.score;
    if (n.score > 0) byEpisodeDuration[episodeDurationKey].globalCountScore++;

    if (n.season !== '') {
      const seasonYearKey = n.season + '-' + n.seasonYear;
      if (!bySeason[seasonYearKey]) bySeason[seasonYearKey] = 0;
      bySeason[seasonYearKey]++;
    }

    if (n.startYear > 0) {
      if (minYear == -1 || n.startYear < minYear) minYear = n.startYear;
      if (n.startYear > maxYear) maxYear = n.startYear;

      const year = n.startYear.toString();
      if (!byYear[year]) {
        byYear[year] = {
          count: 0,
          globalSumScore: 0,
          globalCountScore: 0,
          sumScore: 0,
          countScore: 0,
          nodes: [],
        };
      }
      byYear[year].count++;
      byYear[year].nodes.push(n);
      if (n.userAnimeScore > 0) byYear[year].sumScore += n.userAnimeScore;
      if (n.userAnimeScore > 0) byYear[year].countScore++;
      if (n.score > 0) byYear[year].globalSumScore += n.score;
      if (n.score > 0) byYear[year].globalCountScore++;
    }
  });

  // Fill missing year.
  for (let i = minYear; i <= maxYear; i++) {
    const year = i.toString();
    if (!byYear[year]) {
      byYear[year] = { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] };
    }
  }

  return (
    <Dialog
      open={open}
      fullScreen
      slots={{ transition: SlideTransition }}
      slotProps={{ paper: { sx: styles.dialogPaper } }}
    >
      <DialogTitle>
        <Grid container>
          <Grid>{`${ctx.username}'s Stats`}</Grid>
          <Grid size="grow" />
          <Grid>
            <IconButton onClick={toggleOpen} size="small">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Total Anime"
              value={inList.length.toLocaleString()}
              tooltip={`${nonZeroScore.length.toLocaleString()} rated anime`}
              chart={
                <MiniBarChart
                  data={Object.keys(byYear)
                    .map((k) => ({ value: byYear[k].count }))
                    .filter((d) => d.value > 0)}
                />
              }
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Average Score"
              value={avgScore.toFixed(2)}
              tooltip={
                <>
                  {globalAvgScore.toFixed(2)} average global score{' '}
                  <span style={avgScore > globalAvgScore ? styles.scoreGreen : styles.scoreRed}>
                    ({avgScore > globalAvgScore ? '+' : ''}
                    {(avgScore - globalAvgScore).toFixed(2)})
                  </span>
                </>
              }
              chart={
                <MiniAreaChart
                  data={Object.keys(byYear)
                    .map((k) => ({
                      value: byYear[k].sumScore / byYear[k].countScore,
                    }))
                    .filter((d) => d.value > 0)}
                />
              }
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Total Episodes"
              value={ctx.graphData.nodes.reduce((total, next) => total + next.userEpisodeCount, 0).toLocaleString()}
              tooltip="sum of watched episodes"
              chart={
                <MiniAreaChart
                  data={Object.keys(byEpisodeCount)
                    .map((k) => ({
                      value: byEpisodeCount[k].sumScore / byEpisodeCount[k].countScore,
                    }))
                    .filter((d) => d.value > 0)}
                />
              }
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Total Duration (days)"
              value={(
                ctx.graphData.nodes.reduce((total, next) => total + next.userEpisodeCount * next.episodeDuration, 0) /
                (60 * 60 * 24)
              )
                .toFixed(2)
                .toLocaleString()}
              chart={
                <MiniAreaChart
                  data={Object.keys(byEpisodeDuration)
                    .map((k) => ({
                      value: byEpisodeDuration[k].sumScore / byEpisodeDuration[k].countScore,
                    }))
                    .filter((d) => d.value > 0)}
                />
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <ChartCard title="Anime by Status">
              <BarChart
                config={{ valueName: 'count' }}
                data={Object.values(UserAnimeStatus)
                  .slice(1)
                  .map((k) => ({
                    label: UserAnimeStatusStr(k),
                    value: byStatus[k],
                    color: ctx.nodeColor[k],
                    nodes: inList
                      .filter((n) => n.userAnimeStatus === k)
                      .sort((a: Node, b: Node) => a.title.localeCompare(b.title)),
                  }))}
              />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ChartCard title="Anime by Type">
              <RadarChart
                config={{ valueName: 'count' }}
                data={Object.values(AnimeType)
                  .slice(1)
                  .map((k) => ({
                    label: AnimeTypeToStr(k),
                    value: byType[k],
                    nodes: inList.filter((n) => n.type == k).sort((a: Node, b: Node) => a.title.localeCompare(b.title)),
                  }))
                  .sort((a, b) => b.value - a.value)}
              />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ChartCard title="Anime by Source">
              <PieChart
                config={{ valueName: 'count' }}
                data={Object.values(AnimeSource)
                  .map((k) => ({
                    label: AnimeSourceToStr(k),
                    value: bySource[k],
                    nodes: inList
                      .filter((n) => n.source == k)
                      .sort((a: Node, b: Node) => a.title.localeCompare(b.title)),
                  }))
                  .sort((a, b) => b.value - a.value)}
              />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <ChartCard title="Anime by Episode Count & Score">
              <BarLineChart
                config={{
                  valueBarName: 'count',
                  valueLine1Name: 'user score',
                  valueLine2Name: 'global score',
                }}
                data={Object.keys(byEpisodeCount).map((k) => ({
                  label: k,
                  valueBar: byEpisodeCount[k].count,
                  valueLine1: byEpisodeCount[k].sumScore / byEpisodeCount[k].countScore,
                  valueLine2: byEpisodeCount[k].globalSumScore / byEpisodeCount[k].globalCountScore,
                  nodes: byEpisodeCount[k].nodes.sort((a: Node, b: Node) => a.title.localeCompare(b.title)),
                }))}
              />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <ChartCard title="Anime by Episode Duration (minutes) & Score">
              <BarLineChart
                config={{
                  valueBarName: 'count',
                  valueLine1Name: 'user score',
                  valueLine2Name: 'global score',
                }}
                data={Object.keys(byEpisodeDuration).map((k) => ({
                  label: k,
                  valueBar: byEpisodeDuration[k].count,
                  valueLine1: byEpisodeDuration[k].sumScore / byEpisodeDuration[k].countScore,
                  valueLine2: byEpisodeDuration[k].globalSumScore / byEpisodeDuration[k].globalCountScore,
                  nodes: byEpisodeDuration[k].nodes.sort((a: Node, b: Node) => a.title.localeCompare(b.title)),
                }))}
              />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
            <ChartCard title="Anime by Year & Score">
              <BarLineChart
                config={{
                  valueBarName: 'count',
                  valueLine1Name: 'user score',
                  valueLine2Name: 'global score',
                  useBrush: true,
                  brushIndex: Object.keys(byYear).length > 10 ? Object.keys(byYear).length - 10 : 0,
                }}
                data={Object.keys(byYear).map((k) => ({
                  label: k,
                  valueBar: byYear[k].count,
                  valueLine1: byYear[k].sumScore / byYear[k].countScore,
                  valueLine2: byYear[k].globalSumScore / byYear[k].globalCountScore,
                  nodes: byYear[k].nodes.sort((a: Node, b: Node) => a.title.localeCompare(b.title)),
                }))}
              />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
            <ChartCard title="Anime by Season & Year">
              <ScatterChart
                config={{
                  xName: 'year',
                  yName: 'season',
                  zName: 'count',
                }}
                data={Object.keys(bySeason)
                  .slice(1)
                  .map((k) => {
                    const seasonYear = k.split('-');
                    return {
                      x: parseInt(seasonYear[1], 10),
                      y: SeasonToStr(seasonYear[0] as Season),
                      z: bySeason[k],
                      nodes: inList
                        .filter((n) => n.season + '-' + n.seasonYear == k)
                        .sort((a: Node, b: Node) => a.title.localeCompare(b.title)),
                    };
                  })}
              />
            </ChartCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnimeListCard
              title="Top Highest Score"
              valueFormatter={(n) => n.score.toFixed(2)}
              nodes={[...ctx.graphData.nodes].sort((a, b) => b.score - a.score)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnimeListCard
              title="Most Episode Count"
              valueFormatter={(n) => n.episodeCount.toLocaleString()}
              nodes={[...ctx.graphData.nodes].sort((a, b) => b.episodeCount - a.episodeCount)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnimeListCard
              title="Longest Episode Duration (minutes)"
              valueFormatter={(n) => (n.episodeDuration / 60).toFixed(0).toLocaleString()}
              nodes={[...ctx.graphData.nodes].sort((a, b) => b.episodeDuration - a.episodeDuration)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnimeListCard
              title="Most Relation Count"
              valueFormatter={(n) => n.neighbors.length.toLocaleString()}
              nodes={[...ctx.graphData.nodes].sort((a, b) => b.neighbors.length - a.neighbors.length)}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});

export default StatsDialog;

const StatsCard = ({
  title,
  value,
  tooltip = '',
  chart,
}: {
  title: string;
  value: string;
  tooltip?: NonNullable<ReactNode>;
  chart: ReactNode;
}) => {
  return (
    <Card sx={{ position: 'relative' }}>
      <Box sx={styles.statsChart}>{chart}</Box>
      <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography gutterBottom sx={styles.statsTitle}>
          {title}
        </Typography>
        <Tooltip title={tooltip} placement="bottom" arrow>
          <Typography variant="h3">{value}</Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

const ChartCard = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', height: 300 }}>
        <Typography gutterBottom sx={styles.statsTitle}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

const AnimeListCard = ({
  title,
  nodes,
  valueFormatter,
}: {
  title: string;
  nodes: Node[];
  valueFormatter: (node: Node) => string;
}) => {
  const ctx = useCtx();
  const rowsPerPage = 10;

  const [inList, setInList] = useState(false);
  const [page, setPage] = useState(0);

  const toggleInList = () => setInList(!inList);
  const onPrevPage = () => setPage(page - 1);
  const onNextPage = () => setPage(page + 1);

  return (
    <Card>
      <CardContent>
        <Typography sx={{ ...styles.statsTitle, textAlign: 'center', marginBottom: 1 }}>{title}</Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Divider />
          </Grid>
          {nodes
            .filter((n) => !inList || n.userAnimeStatus !== '')
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((n, i) => {
              return (
                <Fragment key={n.id}>
                  <Grid size={1} sx={{ textAlign: 'right' }}>
                    {`${page * rowsPerPage + i + 1}.`}
                  </Grid>
                  <Grid size={1} sx={{ textAlign: 'center' }}>
                    <StatusCircle status={n.userAnimeStatus} />
                  </Grid>
                  <Grid size={8} sx={{ overflowX: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    <Link
                      color="inherit"
                      underline="hover"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => ctx.onOpenDrawer(n.id)}
                    >
                      {n.title}
                    </Link>
                  </Grid>
                  <Grid size={2} sx={{ textAlign: 'right' }}>
                    {valueFormatter(n)}
                  </Grid>
                </Fragment>
              );
            })}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12} container spacing={2}>
            <Grid>
              <Tooltip title={inList ? 'show in list only' : 'show all'} placement="right" arrow>
                <IconButton onClick={toggleInList} size="small">
                  {inList ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid size="grow" />
            <Grid>
              <IconButton onClick={onPrevPage} size="small" disabled={page === 0}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={onNextPage} size="small">
                <ChevronRightIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
