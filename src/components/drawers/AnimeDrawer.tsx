import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronLefttIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { Fragment, memo, useEffect, useState } from 'react';
import { Anime, Genre, Related } from '@/app/api/anime/[id]/route';
import StatusCircle from '@/src/components/circles/StatusCircle';
import { useCtx } from '@/src/components/context';
import AnimeDrawerSkeleton from '@/src/components/drawers/AnimeDrawerSkeleton';
import { AnimeDrawerType, defaultAnimeDrawer } from '@/src/components/drawers/types';
import { Node } from '@/src/components/graphs/types';
import theme from '@/src/components/theme';
import {
  AnimeRelation,
  AnimeRelationToStr,
  AnimeStatusToStr,
  AnimeTypeToStr,
  Day,
  DayToStr,
  Season,
  SeasonToStr,
  UserAnimeStatus,
} from '@/src/libs/constant';
import { getNodeMap, getRelatedIDs } from '@/src/libs/graph';
import { DateToStr, getAxiosError } from '@/src/libs/utils';

const styles = {
  drawer: {
    width: 500,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    padding: 2,
    zIndex: 1301,
  },
  tooltip: {
    '& .MuiTooltip-tooltip': {
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
    textAlign: 'center',
    position: 'relative',
  },
  image: {
    height: '100%',
    maxHeight: 350,
    maxWidth: '100%',
  },
  picturePrevButton: {
    position: 'absolute',
    top: '50%',
    left: 16,
    transform: 'translateY(-50%)',
  },
  pictureNextButton: {
    position: 'absolute',
    top: '50%',
    right: 16,
    transform: 'translateY(-50%)',
  },
  scoreGreen: {
    color: theme.palette.success.main,
  },
  scoreRed: {
    color: theme.palette.error.main,
  },
};

const AnimeDrawer = memo(function AnimeDrawer({
  animeID,
  open,
  onClose,
}: {
  animeID: number;
  open: boolean;
  onClose: () => void;
}) {
  const ctx = useCtx();

  const nodeMap = getNodeMap(ctx.graphData.nodes);

  const [node, setNode] = useState<Node>();
  const [anime, setAnime] = useState<AnimeDrawerType>(defaultAnimeDrawer);
  const [pictureIndex, setPictureIndex] = useState(0);
  const [showExtended, setShowExtended] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnimeID, setDrawerAnimeID] = useState(0);

  const onPrevPicture = () => {
    if (pictureIndex <= 0) return;
    setPictureIndex(pictureIndex - 1);
  };

  const onNextPicture = () => {
    if (pictureIndex >= anime.pictures.length - 1) return;
    setPictureIndex(pictureIndex + 1);
  };

  const onOpenDrawer = (id: number) => {
    setDrawerOpen(true);
    setDrawerAnimeID(id);
  };

  const onCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerAnimeID(0);
  };

  const toggleExtended = () => {
    setShowExtended(!showExtended);
  };

  useEffect(() => {
    if (!open) return;

    if (animeID === 0) {
      setLoading(false);
      setError('empty id');
      return;
    }

    setLoading(true);
    setError('');

    axios
      .get(`/api/anime/${animeID}`)
      .then((resp) => {
        const data: Anime = resp.data.data;

        const episodeDuration = new Date(0);
        episodeDuration.setSeconds(data.episode.duration);

        const relatedIDs = getRelatedIDs(ctx.graphData.nodes, animeID, true);

        const nodeTmp = nodeMap.get(animeID);
        setNode(nodeTmp);

        setAnime({
          id: data.id,
          title: data.title,
          titleSynonyms: data.alternative_titles.synonyms,
          titleEnglish: data.alternative_titles.english,
          titleJapanese: data.alternative_titles.japanese,
          pictures: Array.from(new Set([data.picture].concat(data.pictures))),
          synopsis: data.synopsis || '-',
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
          season: data.season?.season || Season[''],
          seasonYear: data.season?.year || 0,
          broadcastDay: data.broadcast?.day || Day[''],
          broadcastTime: data.broadcast?.time || '',
          genres: data.genres.map((g: Genre) => g.name),
          related: data.related,
          extendedRelated: ctx.graphData.nodes
            .filter((n) => relatedIDs.includes(n.id))
            .filter((r) => r.id !== animeID)
            .map(
              (r: Node): Related => ({
                id: r.id,
                title: r.title,
                picture: '',
                relation: AnimeRelation[''],
              }),
            )
            .sort((a, b) => a.title.localeCompare(b.title)),
        });

        setPictureIndex(0);
        setShowExtended(false);
      })
      .catch((error) => setError(getAxiosError(error)))
      .finally(() => setLoading(false));
  }, [open, animeID]);

  return (
    <>
      <Drawer open={open} anchor="right" variant="persistent" slotProps={{ paper: { sx: styles.drawer } }}>
        <Grid container spacing={2}>
          <Grid size={12} container>
            <Grid>
              <Tooltip title="Close" placement="right" arrow>
                <IconButton onClick={onClose}>{open ? <ChevronRightIcon /> : <ChevronLefttIcon />}</IconButton>
              </Tooltip>
            </Grid>
            <Grid size="grow" />
            <Grid>
              <StatusCircle status={node?.userAnimeStatus || UserAnimeStatus['']} sx={{ marginTop: 10 }} />
            </Grid>
          </Grid>

          {error !== '' ? (
            <Grid size={12} sx={{ textAlign: 'center', color: 'red' }}>
              {error}
            </Grid>
          ) : loading ? (
            <AnimeDrawerSkeleton />
          ) : (
            <>
              <Grid size={12}>
                <Tooltip
                  placement="left"
                  arrow
                  slotProps={{ popper: { sx: styles.tooltip } }}
                  title={
                    (anime.titleSynonyms.length > 0 || anime.titleEnglish !== '' || anime.titleJapanese !== '') && (
                      <Grid container spacing={1}>
                        {anime.titleSynonyms.length > 0 && (
                          <>
                            <Grid size={4} sx={{ ...styles.statsTitle, textAlign: 'right' }}>
                              <Typography variant="subtitle2">Synonym</Typography>
                            </Grid>
                            <Grid size={8} container spacing={1}>
                              {anime.titleSynonyms.map((t) => (
                                <Grid size={12} key={t}>
                                  <Typography>{t}</Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        )}
                        {anime.titleEnglish !== '' && (
                          <>
                            <Grid size={4} sx={{ ...styles.statsTitle, textAlign: 'right' }}>
                              <Typography variant="subtitle2">English</Typography>
                            </Grid>
                            <Grid size={8}>
                              <Typography>{anime.titleEnglish}</Typography>
                            </Grid>
                          </>
                        )}
                        {anime.titleJapanese !== '' && (
                          <>
                            <Grid size={4} sx={{ ...styles.statsTitle, textAlign: 'right' }}>
                              <Typography variant="subtitle2">Japanese</Typography>
                            </Grid>
                            <Grid size={8}>
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

              <Grid size={12} sx={styles.imageArea}>
                <img src={anime.pictures[pictureIndex]} alt={anime.title} style={styles.image} />
                <IconButton onClick={onPrevPicture} disabled={pictureIndex <= 0} sx={styles.picturePrevButton}>
                  <Tooltip placement="right" arrow title="Previous picture">
                    <ArrowBackIosNewIcon />
                  </Tooltip>
                </IconButton>
                <IconButton
                  onClick={onNextPicture}
                  disabled={pictureIndex >= anime.pictures.length - 1}
                  sx={styles.pictureNextButton}
                >
                  <Tooltip placement="right" arrow title="Next picture">
                    <ArrowForwardIosIcon />
                  </Tooltip>
                </IconButton>
              </Grid>

              <Grid size={4}>
                <Divider sx={styles.statsTitle}>Rank</Divider>
                <Typography variant="h6" align="center">
                  <b>#{anime.rank.toLocaleString()}</b>
                </Typography>
              </Grid>

              <Grid size={4}>
                <Divider sx={styles.statsTitle}>Score</Divider>
                <Tooltip
                  placement="bottom"
                  arrow
                  slotProps={{ popper: { sx: styles.tooltip } }}
                  title={
                    !node?.userAnimeStatus ? (
                      ''
                    ) : (
                      <>
                        Your score: {node?.userAnimeScore.toFixed(2)}{' '}
                        {node?.score > 0 && node?.userAnimeScore > 0 && (
                          <span style={node.userAnimeScore > node.score ? styles.scoreGreen : styles.scoreRed}>
                            ({node.userAnimeScore > node.score ? `+` : ''}
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

              <Grid size={4}>
                <Divider sx={styles.statsTitle}>Popularity</Divider>
                <Tooltip
                  placement="bottom"
                  arrow
                  slotProps={{ popper: { sx: { ...styles.tooltip, width: 160 } } }}
                  title={
                    <Grid container spacing={1}>
                      <Grid size={6} sx={styles.statsTitle}>
                        Watching
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
                        {anime.stats.watching.toLocaleString()}
                      </Grid>
                      <Grid size={6} sx={styles.statsTitle}>
                        Completed
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
                        {anime.stats.completed.toLocaleString()}
                      </Grid>
                      <Grid size={6} sx={styles.statsTitle}>
                        On Hold
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
                        {anime.stats.onHold.toLocaleString()}
                      </Grid>
                      <Grid size={6} sx={styles.statsTitle}>
                        Dropped
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
                        {anime.stats.dropped.toLocaleString()}
                      </Grid>
                      <Grid size={6} sx={styles.statsTitle}>
                        Planned
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
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

              <Grid size={6}>
                <Divider sx={styles.statsTitle}>Type</Divider>
                <Typography variant="h6" align="center">
                  <b>{AnimeTypeToStr(anime.type)}</b>
                </Typography>
              </Grid>

              <Grid size={6}>
                <Divider sx={styles.statsTitle}>Status</Divider>
                <Tooltip
                  placement="left"
                  arrow
                  slotProps={{ popper: { sx: { ...styles.tooltip, width: 230 } } }}
                  title={
                    <Grid container spacing={1}>
                      <Grid size={6} sx={styles.statsTitle}>
                        Episode Count
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
                        {anime.episodeCount.toLocaleString()}
                      </Grid>
                      <Grid size={6} sx={styles.statsTitle}>
                        Episode Duration
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
                        {anime.episodeDuration}
                      </Grid>
                      {anime.season !== '' && (
                        <>
                          <Grid size={6} sx={styles.statsTitle}>
                            Season
                          </Grid>
                          <Grid size={6} sx={{ textAlign: 'right' }}>
                            {SeasonToStr(anime.season)} {anime.seasonYear}
                          </Grid>
                        </>
                      )}
                      {anime.broadcastDay !== '' && (
                        <>
                          <Grid size={6} sx={styles.statsTitle}>
                            Broadcast
                          </Grid>
                          <Grid size={6} sx={{ textAlign: 'right' }}>
                            {DayToStr(anime.broadcastDay)} {anime.broadcastTime}
                          </Grid>
                        </>
                      )}
                      <Grid size={6} sx={styles.statsTitle}>
                        Start Date
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
                        {anime.startDate || '-'}
                      </Grid>
                      <Grid size={6} sx={styles.statsTitle}>
                        End Date
                      </Grid>
                      <Grid size={6} sx={{ textAlign: 'right' }}>
                        {anime.endDate || '-'}
                      </Grid>
                    </Grid>
                  }
                >
                  <Typography variant="h6" align="center">
                    <b>{AnimeStatusToStr(anime.status)}</b>
                  </Typography>
                </Tooltip>
              </Grid>

              <Grid size={12} sx={{ textAlign: 'justify' }}>
                <Divider sx={{ ...styles.statsTitle, marginBottom: 1 }}>Synopsis</Divider>
                <Typography sx={{ whiteSpace: 'pre-line' }}>{anime.synopsis}</Typography>
              </Grid>

              <Grid size={12} sx={{ textAlign: 'center' }}>
                <Divider sx={{ ...styles.statsTitle, marginBottom: 1 }}>Genres</Divider>
                {anime.genres.map((g) => (
                  <Chip size="small" label={g} key={g} sx={{ margin: 0.5 }} />
                ))}
              </Grid>

              <Grid size={12} container spacing={2}>
                <Grid size={12}>
                  <Tooltip placement="left" arrow title={anime.related.length.toLocaleString()}>
                    <Divider sx={{ ...styles.statsTitle, marginBottom: 1 }}>Related</Divider>
                  </Tooltip>
                </Grid>
                {Array.from(new Set(anime.related.map((r) => r.relation))).map((r) => {
                  return (
                    <Grid size={12} container spacing={2} key={r}>
                      <Grid size={3} sx={{ ...styles.statsTitle, textAlign: 'right' }}>
                        <Tooltip
                          placement="left"
                          arrow
                          title={anime.related.filter((a) => a.relation === r).length.toLocaleString()}
                        >
                          <span>{AnimeRelationToStr(r)}</span>
                        </Tooltip>
                      </Grid>
                      <Grid size={9} container spacing={1}>
                        {anime.related
                          .filter((a) => a.relation === r)
                          .map((r) => {
                            const n = nodeMap.get(r.id);
                            return (
                              <Grid size={12} container key={r.id}>
                                <Grid size={1}>
                                  <StatusCircle
                                    status={n?.userAnimeStatus || UserAnimeStatus['']}
                                    sx={{ marginTop: 2 }}
                                  />
                                </Grid>
                                <Grid size={11}>
                                  <Link
                                    color="inherit"
                                    underline="hover"
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => onOpenDrawer(r.id)}
                                  >
                                    {r.title}
                                  </Link>
                                </Grid>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>

              <Grid size={12} container spacing={2}>
                <Grid size={12}>
                  <Tooltip placement="left" arrow title={anime.extendedRelated.length.toLocaleString()}>
                    <Divider sx={{ ...styles.statsTitle, marginBottom: 1, cursor: 'pointer' }} onClick={toggleExtended}>
                      {showExtended ? (
                        <ExpandLessIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                      ) : (
                        <ExpandMoreIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                      )}{' '}
                      Extended Related{' '}
                      {showExtended ? (
                        <ExpandLessIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                      ) : (
                        <ExpandMoreIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                      )}
                    </Divider>
                  </Tooltip>
                </Grid>
                {showExtended &&
                  anime.extendedRelated.map((r) => (
                    <Fragment key={r.id}>
                      <Grid size={1} />
                      <Grid size={1}>
                        <StatusCircle
                          status={nodeMap.get(r.id)?.userAnimeStatus || UserAnimeStatus['']}
                          sx={{ marginTop: 2 }}
                        />
                      </Grid>
                      <Grid size={10}>
                        <Link
                          color="inherit"
                          underline="hover"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => onOpenDrawer(r.id)}
                        >
                          {r.title}
                        </Link>
                      </Grid>
                    </Fragment>
                  ))}
              </Grid>
            </>
          )}
        </Grid>
      </Drawer>
      {open && <AnimeDrawer animeID={drawerAnimeID} open={drawerOpen} onClose={onCloseDrawer} />}
    </>
  );
});

export default AnimeDrawer;
