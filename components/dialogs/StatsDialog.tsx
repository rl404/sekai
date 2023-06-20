import BarChart from "../charts/BarChart";
import BarLineChart from "../charts/BarLineChart";
import MiniAreaChart from "../charts/MiniAreaChart";
import MiniBarChart from "../charts/MiniBarChart";
import PieChart from "../charts/PieChart";
import RadarChart from "../charts/RadarChart";
import ScatterChart from "../charts/ScatterChart";
import StatusCircle from "../circles/StatusCircle";
import { useCtx } from "../context";
import AnimeDrawer from "../drawers/AnimeDrawer";
import { AnimeDrawerRefType } from "../drawers/types";
import { Node } from "../graphs/types";
import { theme } from "../theme";
import SlideTransition from "../transitions/SlideTransition";
import {
  AnimeSource,
  AnimeSourceToStr,
  AnimeType,
  AnimeTypeToStr,
  SeasonToStr,
  UserAnimeStatus,
  UserAnimeStatusStr,
} from "@/libs/constant";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
} from "@mui/material";
import { Fragment, ReactNode, forwardRef, memo, useImperativeHandle, useRef, useState } from "react";

const StatsDialog = memo(
  forwardRef((_, ref) => {
    const ctx = useCtx();
    const drawerRef = useRef<AnimeDrawerRefType>();

    const [open, setOpen] = useState(false);
    const [drawerAnimeID, setDrawerAnimeID] = useState(0);

    const inList = ctx.graph.nodes.filter((n) => n.userAnimeStatus !== "");
    const nonZeroScore = ctx.graph.nodes.filter((n) => n.userAnimeScore !== 0);
    const avgScore = nonZeroScore.reduce((total, next) => total + next.userAnimeScore, 0) / nonZeroScore.length;
    const globalNonZeroScore = inList.filter((n) => n.score > 0);
    const globalAvgScore =
      globalNonZeroScore.reduce((total, next) => total + next.score, 0) / globalNonZeroScore.length;

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
      "1": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "2-6": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "7-13": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "14-26": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "27-52": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "53-100": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "101+": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "?": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
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
      "< 1": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "1-5": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "6-10": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "11-15": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "16-30": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "31-60": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "61-120": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "121+": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
      "?": { count: 0, globalSumScore: 0, globalCountScore: 0, sumScore: 0, countScore: 0, nodes: [] },
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

    var minYear = -1;
    var maxYear = new Date().getFullYear();

    ctx.graph.nodes
      .filter((n) => n.userAnimeStatus !== "" && n.type !== "")
      .forEach((n) => {
        byType[n.type]++;
        byStatus[n.userAnimeStatus]++;
        n.source && bySource[n.source]++;

        var episodeCountKey = "?";
        if (n.episodeCount === 1) episodeCountKey = "1";
        if (n.episodeCount >= 2 && n.episodeCount < 7) episodeCountKey = "2-6";
        if (n.episodeCount >= 7 && n.episodeCount < 14) episodeCountKey = "7-13";
        if (n.episodeCount >= 14 && n.episodeCount < 27) episodeCountKey = "14-26";
        if (n.episodeCount >= 27 && n.episodeCount < 53) episodeCountKey = "27-52";
        if (n.episodeCount >= 53 && n.episodeCount < 101) episodeCountKey = "53-100";
        if (n.episodeCount >= 101) episodeCountKey = "101+";

        byEpisodeCount[episodeCountKey].count++;
        byEpisodeCount[episodeCountKey].nodes.push(n);
        n.userAnimeScore > 0 && (byEpisodeCount[episodeCountKey].sumScore += n.userAnimeScore);
        n.userAnimeScore > 0 && byEpisodeCount[episodeCountKey].countScore++;
        n.score > 0 && (byEpisodeCount[episodeCountKey].globalSumScore += n.score);
        n.score > 0 && byEpisodeCount[episodeCountKey].globalCountScore++;

        var episodeDurationKey = "?";
        if (n.episodeDuration > 0) {
          const dur = n.episodeDuration / 60;
          if (dur < 1) episodeDurationKey = "< 1";
          if (dur >= 1 && dur < 6) episodeDurationKey = "1-5";
          if (dur >= 6 && dur < 11) episodeDurationKey = "6-10";
          if (dur >= 11 && dur < 16) episodeDurationKey = "11-15";
          if (dur >= 16 && dur < 31) episodeDurationKey = "16-30";
          if (dur >= 31 && dur < 61) episodeDurationKey = "31-60";
          if (dur >= 61 && dur < 121) episodeDurationKey = "61-120";
          if (dur >= 121) episodeDurationKey = "121+";
        }

        byEpisodeDuration[episodeDurationKey].count++;
        byEpisodeDuration[episodeDurationKey].nodes.push(n);
        n.userAnimeScore > 0 && (byEpisodeDuration[episodeDurationKey].sumScore += n.userAnimeScore);
        n.userAnimeScore > 0 && byEpisodeDuration[episodeDurationKey].countScore++;
        n.score > 0 && (byEpisodeDuration[episodeDurationKey].globalSumScore += n.score);
        n.score > 0 && byEpisodeDuration[episodeDurationKey].globalCountScore++;

        if (n.season !== "") {
          const seasonYearKey = n.season + "-" + n.seasonYear;
          !bySeason[seasonYearKey] && (bySeason[seasonYearKey] = 0);
          bySeason[seasonYearKey]++;
        }

        if (n.startYear > 0) {
          if (minYear == -1 || n.startYear < minYear) minYear = n.startYear;
          if (n.startYear > maxYear) maxYear = n.startYear;

          const year = n.startYear.toString();
          !byYear[year] &&
            (byYear[year] = {
              count: 0,
              globalSumScore: 0,
              globalCountScore: 0,
              sumScore: 0,
              countScore: 0,
              nodes: [],
            });
          byYear[year].count++;
          byYear[year].nodes.push(n);
          n.userAnimeScore > 0 && (byYear[year].sumScore += n.userAnimeScore);
          n.userAnimeScore > 0 && byYear[year].countScore++;
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

    const onClose = () => {
      setOpen(false);
    };

    const onClickAnime = (animeID: number) => {
      setDrawerAnimeID(animeID);
      drawerRef.current?.setOpen(true);
    };

    useImperativeHandle(ref, () => {
      return {
        setOpen(open: boolean) {
          setOpen(open);
        },
      };
    });

    return (
      <>
        <Dialog
          open={open}
          fullScreen
          TransitionComponent={SlideTransition}
          PaperProps={{
            style: {
              backgroundImage: "radial-gradient(rgb(65, 65, 65) 0.5px, #121212 0.5px)",
              backgroundSize: "15px 15px",
            },
          }}
        >
          <DialogTitle>
            <Grid container>
              <Grid item>{`${ctx.username}'s Stats`}</Grid>
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
                        .map((k) => ({ value: byYear[k].count }))
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
                      {globalAvgScore.toFixed(2)} average global score{" "}
                      <span style={avgScore > globalAvgScore ? style.scoreGreen : style.scoreRed}>
                        ({avgScore > globalAvgScore ? "+" : ""}
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

              <Grid item xs={6} sm={3}>
                <StatsCard
                  title="Total Episodes"
                  value={ctx.graph.nodes.reduce((total, next) => total + next.userEpisodeCount, 0).toLocaleString()}
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

              <Grid item xs={6} sm={3}>
                <StatsCard
                  title="Total Duration (days)"
                  value={(
                    ctx.graph.nodes.reduce((total, next) => total + next.userEpisodeCount * next.episodeDuration, 0) /
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

              <Grid item xs={12} sm={12} md={6}>
                <ChartCard title="Anime by Status">
                  <BarChart
                    config={{ valueName: "count" }}
                    data={Object.keys(byStatus).map((k) => ({
                      label: UserAnimeStatusStr(k),
                      value: byStatus[k],
                      color: ctx.nodeColor[k],
                      nodes: ctx.graph.nodes.filter((n) => n.userAnimeStatus === k),
                    }))}
                  />
                </ChartCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ChartCard title="Anime by Type">
                  <RadarChart
                    config={{ valueName: "count" }}
                    data={Object.keys(byType)
                      .map((k) => ({
                        label: AnimeTypeToStr(k),
                        value: byType[k],
                        nodes: ctx.graph.nodes.filter((n) => n.userAnimeStatus !== "" && n.type == k),
                      }))
                      .sort((a, b) => b.value - a.value)}
                  />
                </ChartCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <ChartCard title="Anime by Source">
                  <PieChart
                    config={{ valueName: "count" }}
                    data={Object.keys(bySource)
                      .map((k) => ({
                        label: AnimeSourceToStr(k),
                        value: bySource[k],
                        nodes: ctx.graph.nodes.filter((n) => n.userAnimeStatus !== "" && n.source == k),
                      }))
                      .sort((a, b) => b.value - a.value)}
                  />
                </ChartCard>
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <ChartCard title="Anime by Episode Count & Score">
                  <BarLineChart
                    config={{
                      valueBarName: "count",
                      valueLine1Name: "user score",
                      valueLine2Name: "global score",
                    }}
                    data={Object.keys(byEpisodeCount).map((k) => ({
                      label: k,
                      valueBar: byEpisodeCount[k].count,
                      valueLine1: byEpisodeCount[k].sumScore / byEpisodeCount[k].countScore,
                      valueLine2: byEpisodeCount[k].globalSumScore / byEpisodeCount[k].globalCountScore,
                      nodes: byEpisodeCount[k].nodes,
                    }))}
                  />
                </ChartCard>
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <ChartCard title="Anime by Episode Duration (minutes) & Score">
                  <BarLineChart
                    config={{
                      valueBarName: "count",
                      valueLine1Name: "user score",
                      valueLine2Name: "global score",
                    }}
                    data={Object.keys(byEpisodeDuration).map((k) => ({
                      label: k,
                      valueBar: byEpisodeDuration[k].count,
                      valueLine1: byEpisodeDuration[k].sumScore / byEpisodeDuration[k].countScore,
                      valueLine2: byEpisodeDuration[k].globalSumScore / byEpisodeDuration[k].globalCountScore,
                      nodes: byEpisodeDuration[k].nodes,
                    }))}
                  />
                </ChartCard>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6}>
                <ChartCard title="Anime by Year & Score">
                  <BarLineChart
                    config={{
                      valueBarName: "count",
                      valueLine1Name: "user score",
                      valueLine2Name: "global score",
                      useBrush: true,
                      brushIndex: Object.keys(byYear).length > 10 ? Object.keys(byYear).length - 10 : 0,
                    }}
                    data={Object.keys(byYear).map((k) => ({
                      label: k,
                      valueBar: byYear[k].count,
                      valueLine1: byYear[k].sumScore / byYear[k].countScore,
                      valueLine2: byYear[k].globalSumScore / byYear[k].globalCountScore,
                      nodes: byYear[k].nodes,
                    }))}
                  />
                </ChartCard>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6}>
                <ChartCard title="Anime by Season & Year">
                  <ScatterChart
                    config={{
                      xName: "year",
                      yName: "season",
                      zName: "count",
                    }}
                    data={Object.keys(bySeason).map((k) => {
                      const seasonYear = k.split("-");
                      return {
                        x: parseInt(seasonYear[1], 10),
                        y: SeasonToStr(seasonYear[0]),
                        z: bySeason[k],
                        nodes: ctx.graph.nodes.filter(
                          (n) => n.userAnimeStatus !== "" && n.season + "-" + n.seasonYear == k
                        ),
                      };
                    })}
                  />
                </ChartCard>
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <AnimeListCard
                  title="Top Highest Score"
                  valueFormatter={(n) => n.score.toFixed(2)}
                  nodes={Object.assign<Node[], Node[]>([], ctx.graph.nodes).sort((a, b) => b.score - a.score)}
                  onClickAnime={onClickAnime}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <AnimeListCard
                  title="Most Episode Count"
                  valueFormatter={(n) => n.episodeCount.toLocaleString()}
                  nodes={Object.assign<Node[], Node[]>([], ctx.graph.nodes).sort(
                    (a, b) => b.episodeCount - a.episodeCount
                  )}
                  onClickAnime={onClickAnime}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <AnimeListCard
                  title="Longest Episode Duration (minutes)"
                  valueFormatter={(n) => (n.episodeDuration / 60).toFixed(0).toLocaleString()}
                  nodes={Object.assign<Node[], Node[]>([], ctx.graph.nodes).sort(
                    (a, b) => b.episodeDuration - a.episodeDuration
                  )}
                  onClickAnime={onClickAnime}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <AnimeListCard
                  title="Most Relation Count"
                  valueFormatter={(n) => n.neighbors.length.toLocaleString()}
                  nodes={Object.assign<Node[], Node[]>([], ctx.graph.nodes).sort(
                    (a, b) => b.neighbors.length - a.neighbors.length
                  )}
                  onClickAnime={onClickAnime}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <AnimeDrawer ref={drawerRef} animeID={drawerAnimeID} />
        </Dialog>
      </>
    );
  })
);

export default StatsDialog;

const style = {
  statsTitle: {
    color: theme.palette.grey[500],
  },
  statsChart: {
    position: "absolute" as "absolute",
    top: 0,
    width: "100%",
    height: "100%",
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
  tooltip = "",
  chart,
}: {
  title: string;
  value: string;
  tooltip?: NonNullable<ReactNode>;
  chart: ReactNode;
}) => {
  return (
    <Card sx={{ position: "relative" }}>
      <div style={style.statsChart}>{chart}</div>
      <CardContent sx={{ textAlign: "center", position: "relative" }}>
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

const ChartCard = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: "center", height: 300 }}>
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
  nodes,
  valueFormatter,
  onClickAnime,
}: {
  title: string;
  nodes: Node[];
  valueFormatter: (node: Node) => string;
  onClickAnime: (animeID: number) => void;
}) => {
  const rowsPerPage = 10;

  const [inList, setInList] = useState(false);
  const [page, setPage] = useState(0);

  const toggleInList = () => setInList(!inList);
  const onPrevPage = () => setPage(page - 1);
  const onNextPage = () => setPage(page + 1);

  nodes = nodes
    .filter((n) => !inList || n.userAnimeStatus !== "")
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <CardContent>
        <Typography sx={{ ...style.statsTitle, textAlign: "center", marginBottom: 1 }}>{title}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {nodes.map((n, i) => {
            return (
              <Fragment key={n.id}>
                <Grid item xs={1} sx={{ textAlign: "right" }}>
                  {`${page * rowsPerPage + i + 1}.`}
                </Grid>
                <Grid item xs={1} sx={{ textAlign: "center" }}>
                  <StatusCircle status={n.userAnimeStatus} />
                </Grid>
                <Grid item xs={8} sx={{ overflowX: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  <Link color="inherit" underline="hover" sx={{ cursor: "pointer" }} onClick={() => onClickAnime(n.id)}>
                    {n.title}
                  </Link>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "right" }}>
                  {valueFormatter(n)}
                </Grid>
              </Fragment>
            );
          })}
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} container spacing={2}>
            <Grid item>
              <Tooltip title={inList ? "show in list only" : "show all"} placement="right" arrow>
                <IconButton onClick={toggleInList} size="small">
                  {inList ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs />
            <Grid item>
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
