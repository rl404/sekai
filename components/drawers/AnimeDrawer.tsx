import StatusCircle from "../circles/StatusCircle";
import { useCtx } from "../context";
import { Node } from "../graphs/types";
import { theme } from "../theme";
import AnimeDrawerSkeleton from "./AnimeDrawerSkeleton";
import { AnimeDrawerRefType, AnimeDrawerType, defaultAnimeDrawer } from "./types";
import { AnimeRelationToStr, AnimeStatusToStr, AnimeTypeToStr, DayToStr, SeasonToStr } from "@/libs/constant";
import { DateToStr, getAxiosError } from "@/libs/utils";
import { Anime, Genre, Related } from "@/pages/api/anime/[anime_id]";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronLefttIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Chip, Divider, Drawer, Grid, IconButton, Link, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { Fragment, forwardRef, memo, useEffect, useImperativeHandle, useRef, useState } from "react";

const style = {
  drawer: {
    width: 500,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    padding: 2,
    zIndex: 1301,
  },
  tooltip: {
    "& .MuiTooltip-tooltip": {
      padding: 2,
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
    },
  },
  statsTitle: {
    color: theme.palette.grey[500],
  },
  imageArea: {
    maxHeight: 500,
    textAlign: "center",
    position: "relative",
  },
  image: {
    height: "100%",
    maxHeight: 350,
    maxWidth: "100%",
  },
  picturePrevButton: {
    position: "absolute",
    top: "50%",
    left: 16,
    transform: "translateY(-50%)",
  },
  pictureNextButton: {
    position: "absolute",
    top: "50%",
    right: 16,
    transform: "translateY(-50%)",
  },
  scoreGreen: {
    color: theme.palette.success.main,
  },
  scoreRed: {
    color: theme.palette.error.main,
  },
};

const AnimeDrawer = memo(
  forwardRef(({ animeID = 0 }: { animeID: number }, ref) => {
    const ctx = useCtx();

    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<Node | undefined>();
    const [anime, setAnime] = useState<AnimeDrawerType>(defaultAnimeDrawer);
    const [pictureIndex, setPictureIndex] = useState(0);
    const [showExtended, setShowExtended] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const drawerRef = useRef<AnimeDrawerRefType>();
    const [drawerAnimeID, setDrawerAnimeID] = useState(0);

    const toggleOpen = () => {
      setPictureIndex(0);
      setShowExtended(false);
      setOpen(!open);
    };

    const onPrevPicture = () => {
      if (pictureIndex <= 0) return;
      setPictureIndex(pictureIndex - 1);
    };

    const onNextPicture = () => {
      if (pictureIndex >= anime.pictures.length - 1) return;
      setPictureIndex(pictureIndex + 1);
    };

    const onClickRelation = (id: number) => {
      setDrawerAnimeID(id);
      drawerRef.current?.setOpen(true);
    };

    const toggleExtended = () => {
      setShowExtended(!showExtended);
    };

    useEffect(() => {
      if (animeID === 0) {
        setLoading(false);
        setError("empty id");
        return;
      }

      setLoading(true);
      setError("");

      axios
        .get(`/api/anime/${animeID}`)
        .then((resp) => {
          const data: Anime = resp.data.data;

          const episodeDuration = new Date(0);
          episodeDuration.setSeconds(data.episode.duration);

          var extendedRelated = new Set<Node>();

          const addExtendedRelated = (n: Node) => {
            n.neighbors.forEach((neighbor) => {
              if (extendedRelated.has(neighbor) || neighbor.animeID === anime.id) return;
              extendedRelated.add(neighbor);
              addExtendedRelated(neighbor);
            });
          };

          const nodeTmp = ctx.graph.nodes.find((n) => n.animeID === data.id);
          setNode(nodeTmp);
          nodeTmp && addExtendedRelated(nodeTmp);

          setAnime({
            id: data.id,
            title: data.title,
            titleSynonyms: data.alternative_titles.synonyms,
            titleEnglish: data.alternative_titles.english,
            titleJapanese: data.alternative_titles.japanese,
            pictures: Array.from(new Set([data.picture].concat(data.pictures))),
            synopsis: data.synopsis || "-",
            startDate: DateToStr(data.start_date),
            endDate: DateToStr(data.end_date),
            type: data.type,
            status: data.status,
            rank: data.rank,
            mean: data.mean,
            popularity: data.popularity,
            stats: {
              watching: data.stats.status.watching,
              completed: data.stats.status.completed,
              onHold: data.stats.status.on_hold,
              dropped: data.stats.status.dropped,
              planned: data.stats.status.planned,
            },
            episodeCount: data.episode.count,
            episodeDuration: episodeDuration.toISOString().substring(11, 19),
            season: data.season?.season || "",
            seasonYear: data.season?.year || 0,
            broadcastDay: data.broadcast?.day || "",
            broadcastTime: data.broadcast?.time || "",
            genres: data.genres.map((g: Genre) => g.name),
            related: data.related,
            extendedRelated: Array.from(extendedRelated)
              .map(
                (r: Node): Related => ({
                  id: r.animeID,
                  title: r.title,
                  picture: "",
                  relation: "",
                })
              )
              .sort((a, b) => a.title.localeCompare(b.title)),
          });
        })
        .catch((error) => setError(getAxiosError(error)))
        .finally(() => setLoading(false));
    }, [animeID]);

    useImperativeHandle(ref, () => {
      return {
        setOpen(open: boolean) {
          setOpen(open);
        },
      };
    });

    return (
      <Drawer open={open} anchor="right" variant="persistent" PaperProps={{ sx: style.drawer }}>
        <Grid container spacing={2}>
          <Grid item xs={12} container>
            <Grid item>
              <Tooltip title="Close" placement="right" arrow>
                <IconButton onClick={toggleOpen}>{open ? <ChevronRightIcon /> : <ChevronLefttIcon />}</IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs />
            <Grid item>
              <StatusCircle
                status={ctx.graph.nodes.find((n) => n.animeID === animeID)?.userAnimeStatus || ""}
                sx={{ marginTop: 10 }}
              />
            </Grid>
          </Grid>

          {error !== "" ? (
            <Grid item xs={12} sx={{ textAlign: "center", color: "red" }}>
              {error}
            </Grid>
          ) : loading ? (
            <AnimeDrawerSkeleton />
          ) : (
            <>
              <Grid item xs={12}>
                <Tooltip
                  placement="left"
                  arrow
                  PopperProps={{ sx: style.tooltip }}
                  title={
                    (anime.titleSynonyms.length > 0 || anime.titleEnglish !== "" || anime.titleJapanese !== "") && (
                      <Grid container spacing={1}>
                        {anime.titleSynonyms.length > 0 && (
                          <>
                            <Grid item xs={4} sx={{ ...style.statsTitle, textAlign: "right" }}>
                              <Typography variant="subtitle2">Synonym</Typography>
                            </Grid>
                            <Grid item xs={8} container spacing={1}>
                              {anime.titleSynonyms.map((t) => (
                                <Grid item xs={12} key={t}>
                                  <Typography>{t}</Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        )}
                        {anime.titleEnglish !== "" && (
                          <>
                            <Grid item xs={4} sx={{ ...style.statsTitle, textAlign: "right" }}>
                              <Typography variant="subtitle2">English</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography>{anime.titleEnglish}</Typography>
                            </Grid>
                          </>
                        )}
                        {anime.titleJapanese !== "" && (
                          <>
                            <Grid item xs={4} sx={{ ...style.statsTitle, textAlign: "right" }}>
                              <Typography variant="subtitle2">Japanese</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography>{anime.titleJapanese}</Typography>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    )
                  }
                >
                  <Typography variant="h5" align="center" gutterBottom>
                    <b>
                      <Link
                        href={`https://myanimelist.net/anime/${anime.id}`}
                        color="inherit"
                        underline="hover"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {anime.title}
                      </Link>
                    </b>
                  </Typography>
                </Tooltip>
                <Divider />
              </Grid>

              <Grid item xs={12} sx={style.imageArea}>
                <img src={anime.pictures[pictureIndex]} alt={anime.title} style={style.image} />
                <IconButton onClick={onPrevPicture} disabled={pictureIndex <= 0} sx={style.picturePrevButton}>
                  <Tooltip placement="right" arrow title="Previous picture">
                    <ArrowBackIosNewIcon />
                  </Tooltip>
                </IconButton>
                <IconButton
                  onClick={onNextPicture}
                  disabled={pictureIndex >= anime.pictures.length - 1}
                  sx={style.pictureNextButton}
                >
                  <Tooltip placement="right" arrow title="Next picture">
                    <ArrowForwardIosIcon />
                  </Tooltip>
                </IconButton>
              </Grid>

              <Grid item xs={4}>
                <Divider sx={style.statsTitle}>Rank</Divider>
                <Typography variant="h6" align="center">
                  <b>#{anime.rank.toLocaleString()}</b>
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Divider sx={style.statsTitle}>Score</Divider>
                <Tooltip
                  placement="bottom"
                  arrow
                  PopperProps={{ sx: style.tooltip }}
                  title={
                    !node?.userAnimeStatus ? (
                      ""
                    ) : (
                      <>
                        Your score: {node?.userAnimeScore.toFixed(2)}{" "}
                        {node?.score > 0 && node?.userAnimeScore > 0 && (
                          <span style={node.userAnimeScore > node.score ? style.scoreGreen : style.scoreRed}>
                            ({node.userAnimeScore > node.score ? `+` : ""}
                            {(node.userAnimeScore - node.score).toFixed(2)})
                          </span>
                        )}
                      </>
                    )
                  }
                >
                  <Typography variant="h6" align="center">
                    <b>{anime.mean.toFixed(2)}</b>
                  </Typography>
                </Tooltip>
              </Grid>

              <Grid item xs={4}>
                <Divider sx={style.statsTitle}>Popularity</Divider>
                <Tooltip
                  placement="bottom"
                  arrow
                  PopperProps={{ sx: { ...style.tooltip, width: 160 } }}
                  title={
                    <Grid container spacing={1}>
                      <Grid item xs={6} sx={style.statsTitle}>
                        Watching
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.stats.watching.toLocaleString()}
                      </Grid>
                      <Grid item xs={6} sx={style.statsTitle}>
                        Completed
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.stats.completed.toLocaleString()}
                      </Grid>
                      <Grid item xs={6} sx={style.statsTitle}>
                        On Hold
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.stats.onHold.toLocaleString()}
                      </Grid>
                      <Grid item xs={6} sx={style.statsTitle}>
                        Dropped
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.stats.dropped.toLocaleString()}
                      </Grid>
                      <Grid item xs={6} sx={style.statsTitle}>
                        Planned
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.stats.planned.toLocaleString()}
                      </Grid>
                    </Grid>
                  }
                >
                  <Typography variant="h6" align="center">
                    <b>#{anime.popularity.toLocaleString()}</b>
                  </Typography>
                </Tooltip>
              </Grid>

              <Grid item xs={6}>
                <Divider sx={style.statsTitle}>Type</Divider>
                <Typography variant="h6" align="center">
                  <b>{AnimeTypeToStr(anime.type)}</b>
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Divider sx={style.statsTitle}>Status</Divider>
                <Tooltip
                  placement="left"
                  arrow
                  PopperProps={{ sx: { ...style.tooltip, width: 230 } }}
                  title={
                    <Grid container spacing={1}>
                      <Grid item xs={6} sx={style.statsTitle}>
                        Episode Count
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.episodeCount.toLocaleString()}
                      </Grid>
                      <Grid item xs={6} sx={style.statsTitle}>
                        Episode Duration
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.episodeDuration}
                      </Grid>
                      {anime.season !== "" && (
                        <>
                          <Grid item xs={6} sx={style.statsTitle}>
                            Season
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: "right" }}>
                            {SeasonToStr(anime.season)} {anime.seasonYear}
                          </Grid>
                        </>
                      )}
                      {anime.broadcastDay !== "" && (
                        <>
                          <Grid item xs={6} sx={style.statsTitle}>
                            Broadcast
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: "right" }}>
                            {DayToStr(anime.broadcastDay)} {anime.broadcastTime}
                          </Grid>
                        </>
                      )}
                      <Grid item xs={6} sx={style.statsTitle}>
                        Start Date
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.startDate || "-"}
                      </Grid>
                      <Grid item xs={6} sx={style.statsTitle}>
                        End Date
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: "right" }}>
                        {anime.endDate || "-"}
                      </Grid>
                    </Grid>
                  }
                >
                  <Typography variant="h6" align="center">
                    <b>{AnimeStatusToStr(anime.status)}</b>
                  </Typography>
                </Tooltip>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "justify" }}>
                <Divider sx={{ ...style.statsTitle, marginBottom: 1 }}>Synopsis</Divider>
                <Typography sx={{ whiteSpace: "pre-line" }}>{anime.synopsis}</Typography>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Divider sx={{ ...style.statsTitle, marginBottom: 1 }}>Genres</Divider>
                {anime.genres.map((g) => (
                  <Chip size="small" label={g} key={g} sx={{ margin: 0.5 }} />
                ))}
              </Grid>

              <Grid item xs={12} container spacing={2}>
                <Grid item xs={12}>
                  <Tooltip placement="left" arrow title={anime.related.length.toLocaleString()}>
                    <Divider sx={{ ...style.statsTitle, marginBottom: 1 }}>Related</Divider>
                  </Tooltip>
                </Grid>
                {Array.from(new Set(anime.related.map((r) => r.relation))).map((r) => {
                  return (
                    <Fragment key={r}>
                      <Grid item xs={3} sx={{ ...style.statsTitle, textAlign: "right" }}>
                        <Tooltip
                          placement="left"
                          arrow
                          title={anime.related.filter((a) => a.relation === r).length.toLocaleString()}
                        >
                          <span>{AnimeRelationToStr(r)}</span>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={9} container spacing={1}>
                        {anime.related
                          .filter((a) => a.relation === r)
                          .map((r) => {
                            const n = ctx.graph.nodes.find((n) => n.animeID === r.id);
                            return (
                              <Fragment key={r.id}>
                                <Grid item xs={1}>
                                  <StatusCircle status={n?.userAnimeStatus || ""} sx={{ marginTop: 2 }} />
                                </Grid>
                                <Grid item xs={11}>
                                  <Link
                                    color="inherit"
                                    underline="hover"
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => onClickRelation(r.id)}
                                  >
                                    {r.title}
                                  </Link>
                                </Grid>
                              </Fragment>
                            );
                          })}
                      </Grid>
                    </Fragment>
                  );
                })}
              </Grid>

              <Grid item xs={12} container spacing={2}>
                <Grid item xs={12}>
                  <Tooltip placement="left" arrow title={anime.extendedRelated.length.toLocaleString()}>
                    <Divider sx={{ ...style.statsTitle, marginBottom: 1, cursor: "pointer" }} onClick={toggleExtended}>
                      {showExtended ? (
                        <ExpandLessIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                      ) : (
                        <ExpandMoreIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                      )}{" "}
                      Extended Related{" "}
                      {showExtended ? (
                        <ExpandLessIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                      ) : (
                        <ExpandMoreIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                      )}
                    </Divider>
                  </Tooltip>
                </Grid>
                {showExtended &&
                  anime.extendedRelated.map((r) => {
                    const n = ctx.graph.nodes.find((n) => n.animeID === r.id);
                    return (
                      <Fragment key={r.id}>
                        <Grid item xs={1} />
                        <Grid item xs={1}>
                          <StatusCircle status={n?.userAnimeStatus || ""} sx={{ marginTop: 2 }} />
                        </Grid>
                        <Grid item xs={10}>
                          <Link
                            color="inherit"
                            underline="hover"
                            sx={{ cursor: "pointer" }}
                            onClick={() => onClickRelation(r.id)}
                          >
                            {r.title}
                          </Link>
                        </Grid>
                      </Fragment>
                    );
                  })}
              </Grid>
            </>
          )}
        </Grid>

        {animeID > 0 && <AnimeDrawer ref={drawerRef} animeID={drawerAnimeID} />}
      </Drawer>
    );
  })
);

export default AnimeDrawer;
