import * as React from 'react';
import { Chip, Divider, Drawer, Grid, IconButton, Link, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLefttIcon from '@mui/icons-material/ChevronLeft';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Anime, AnimeDrawerData, AnimeDrawerState, Genre, GraphNode, Related } from '../../types/Types';
import axios from 'axios';
import { theme } from '../theme';
import { DateToStr } from '../../utils/utils';
import { AnimeRelationToStr, AnimeStatusToStr, AnimeTypeToStr, DayToStr, SeasonToStr } from '../../utils/constant';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatusCircle from '../circle/StatusCircle';

const style = {
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '1px solid white',
    marginTop: 10,
  },
  drawer: {
    width: 500,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    padding: 2,
    zIndex: 1301,
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
  titleTooltip: {
    '& .MuiTooltip-tooltip': {
      padding: 2,
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
    },
  },
  scoreTooltip: {
    '& .MuiTooltip-tooltip': {
      padding: 2,
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
    },
  },
  scoreGreen: {
    color: theme.palette.success.main,
  },
  scoreRed: {
    color: theme.palette.error.main,
  },
  dateTooltip: {
    '& .MuiTooltip-tooltip': {
      padding: 2,
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      width: 220,
    },
  },
  statsTooltip: {
    '& .MuiTooltip-tooltip': {
      padding: 2,
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      width: 160,
    },
  },
  imageArea: {
    maxHeight: 500,
    textAlign: 'center',
    position: 'relative',
  },
  image: {
    height: '100%',
    maxWidth: '100%',
  },
  statsTitle: {
    color: theme.palette.grey[500],
  },
  genreChip: {
    margin: 0.5,
  },
};

const AnimeDrawer = ({
  open,
  anime_id,
  onClose,
  nodes,
  nodeColor,
}: {
  open: boolean;
  anime_id: number;
  onClose: any;
  nodes: Array<GraphNode>;
  nodeColor: any;
}) => {
  const [animeState, setAnimeState] = React.useState<AnimeDrawerData>({
    id: 0,
    title: '',
    title_synonyms: [],
    title_english: '',
    title_japanese: '',
    pictures: [],
    synopsis: '',
    start_date: '',
    end_date: '',
    type: '',
    status: '',
    rank: 0,
    mean: 0,
    popularity: 0,
    stats: {
      watching: 0,
      completed: 0,
      on_hold: 0,
      dropped: 0,
      planned: 0,
    },
    episode_count: 0,
    episode_duration: '',
    season: '',
    season_year: 0,
    broadcast_day: '',
    broadcast_time: '',
    genres: [],
    related: [],
    extended_related: [],
    loading: false,
    error: '',
  });

  const node = nodes.find((n) => n.anime_id === anime_id);

  React.useEffect(() => {
    if (!anime_id || anime_id === 0) {
      setAnimeState({ ...animeState, loading: false, error: 'empty id' });
      return;
    }

    setAnimeState({ ...animeState, loading: true, error: '' });

    axios
      .get(`/api/anime/${anime_id}`)
      .then((resp) => {
        const anime: Anime = resp.data.data;

        var episodeDuration = new Date(0);
        episodeDuration.setSeconds(anime.episode.duration);

        var extendedRelated = new Set<GraphNode>();

        const addExtendedRelated = (n: GraphNode) => {
          n.neighbors.forEach((neighbor: GraphNode) => {
            if (extendedRelated.has(neighbor) || neighbor.anime_id === anime.id) return;
            extendedRelated.add(neighbor);
            addExtendedRelated(neighbor);
          });
        };

        node && addExtendedRelated(node);

        setAnimeState({
          ...animeState,
          id: anime.id,
          title: anime.title,
          title_synonyms: anime.alternative_titles.synonyms,
          title_english: anime.alternative_titles.english,
          title_japanese: anime.alternative_titles.japanese,
          pictures: Array.from(new Set([anime.picture].concat(anime.pictures))),
          synopsis: anime.synopsis || '-',
          start_date: DateToStr(anime.start_date),
          end_date: DateToStr(anime.end_date),
          type: anime.type,
          status: anime.status,
          rank: anime.rank,
          mean: anime.mean,
          popularity: anime.popularity,
          stats: {
            watching: anime.stats.status.watching,
            completed: anime.stats.status.completed,
            on_hold: anime.stats.status.on_hold,
            dropped: anime.stats.status.dropped,
            planned: anime.stats.status.planned,
          },
          episode_count: anime.episode.count,
          episode_duration: episodeDuration.toISOString().substring(11, 19),
          season: anime.season?.season || '',
          season_year: anime.season?.year || 0,
          broadcast_day: anime.broadcast?.day || '',
          broadcast_time: anime.broadcast?.time || '',
          genres: anime.genres.map((g: Genre) => g.name),
          related: anime.related,
          extended_related: Array.from(extendedRelated)
            .map((r: GraphNode): Related => {
              return {
                id: r.anime_id,
                title: r.title,
                picture: '',
                relation: '',
              };
            })
            .sort((a, b) => a.title.localeCompare(b.title)),
          loading: false,
          error: '',
        });
        setPictureState(0);
        setShowExtendedRelation(false);
        handleCloseAnimeDrawer();
      })
      .catch((error) => {
        setAnimeState({ ...animeState, loading: false, error: error.response?.data?.message });
      });
  }, [anime_id]);

  const [pictureState, setPictureState] = React.useState(0);

  const handlePrevPicture = () => {
    if (pictureState <= 0) return;
    setPictureState(pictureState - 1);
  };

  const handleNextPicture = () => {
    if (pictureState >= animeState.pictures.length - 1) return;
    setPictureState(pictureState + 1);
  };

  const [animeDrawerState, setAnimeDrawerState] = React.useState<AnimeDrawerState>({
    open: false,
    anime_id: 0,
  });

  const handleOpenAnimeDrawer = (anime_id: number) => {
    setAnimeDrawerState({ ...animeDrawerState, open: true, anime_id: anime_id });
  };

  const handleCloseAnimeDrawer = () => {
    setAnimeDrawerState({ ...animeDrawerState, open: false, anime_id: 0 });
  };

  const [showExtendedRelation, setShowExtendedRelation] = React.useState(false);

  const handleToggleShowExtendedRelation = () => {
    setShowExtendedRelation(!showExtendedRelation);
  };

  return (
    <Drawer open={open} anchor="right" variant="persistent" PaperProps={{ sx: style.drawer }}>
      <Grid container spacing={2}>
        <Grid item xs={12} container>
          <Grid item>
            <Tooltip title="Close" placement="right" arrow>
              <IconButton onClick={onClose}>{open ? <ChevronRightIcon /> : <ChevronLefttIcon />}</IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs />
          <Grid item>
            <StatusCircle
              status={node?.user_anime_status || ''}
              color={nodeColor[node?.user_anime_status || ''] || ''}
              sx={{ marginTop: 10 }}
            />
          </Grid>
        </Grid>
        {animeState.error !== '' ? (
          <Grid item xs={12}>
            {animeState.error}
          </Grid>
        ) : animeState.loading ? (
          <SkeletonDrawer />
        ) : (
          <>
            <Grid item xs={12}>
              <Tooltip
                placement="left"
                arrow
                PopperProps={{ sx: style.titleTooltip }}
                title={
                  (animeState.title_synonyms.length > 0 ||
                    animeState.title_english !== '' ||
                    animeState.title_japanese !== '') && (
                    <Grid container spacing={1}>
                      {animeState.title_synonyms.length > 0 && (
                        <>
                          <Grid item xs={4} sx={{ ...style.statsTitle, textAlign: 'right' }}>
                            <Typography variant="subtitle2">Synonym</Typography>
                          </Grid>
                          <Grid item xs={8} container spacing={1}>
                            {animeState.title_synonyms.map((t) => (
                              <Grid item xs={12} key={t}>
                                <Typography>{t}</Typography>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )}
                      {animeState.title_english !== '' && (
                        <>
                          <Grid item xs={4} sx={{ ...style.statsTitle, textAlign: 'right' }}>
                            <Typography variant="subtitle2">English</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{animeState.title_english}</Typography>
                          </Grid>
                        </>
                      )}
                      {animeState.title_japanese !== '' && (
                        <>
                          <Grid item xs={4} sx={{ ...style.statsTitle, textAlign: 'right' }}>
                            <Typography variant="subtitle2">Japanese</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{animeState.title_japanese}</Typography>
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
                      href={`https://myanimelist.net/anime/${animeState.id}`}
                      color="inherit"
                      underline="hover"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {animeState.title}
                    </Link>
                  </b>
                </Typography>
              </Tooltip>
              <Divider />
            </Grid>
            <Grid item xs={12} sx={style.imageArea}>
              <img src={animeState.pictures[pictureState]} alt={animeState.title} style={style.image} />
              <IconButton onClick={handlePrevPicture} disabled={pictureState <= 0} sx={style.picturePrevButton}>
                <Tooltip placement="right" arrow title="Previous picture">
                  <ArrowBackIosNewIcon />
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={handleNextPicture}
                disabled={pictureState >= animeState.pictures.length - 1}
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
                <b>#{animeState.rank.toLocaleString()}</b>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Divider sx={style.statsTitle}>Score</Divider>
              <Tooltip
                placement="bottom"
                arrow
                PopperProps={{ sx: style.scoreTooltip }}
                title={
                  !node?.user_anime_status ? (
                    ''
                  ) : (
                    <>
                      Your score: {node?.user_anime_score.toFixed(2)}{' '}
                      {node?.score > 0 && node?.user_anime_score > 0 && (
                        <span style={node.user_anime_score > node.score ? style.scoreGreen : style.scoreRed}>
                          ({node.user_anime_score > node.score ? `+` : ''}
                          {(node.user_anime_score - node.score).toFixed(2)})
                        </span>
                      )}
                    </>
                  )
                }
              >
                <Typography variant="h6" align="center">
                  <b>{animeState.mean.toFixed(2)}</b>
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={4}>
              <Divider sx={style.statsTitle}>Popularity</Divider>
              <Tooltip
                placement="bottom"
                arrow
                PopperProps={{ sx: style.statsTooltip }}
                title={
                  <Grid container spacing={1}>
                    <Grid item xs={6} sx={style.statsTitle}>
                      Watching
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.watching.toLocaleString()}
                    </Grid>
                    <Grid item xs={6} sx={style.statsTitle}>
                      Completed
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.completed.toLocaleString()}
                    </Grid>
                    <Grid item xs={6} sx={style.statsTitle}>
                      On Hold
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.on_hold.toLocaleString()}
                    </Grid>
                    <Grid item xs={6} sx={style.statsTitle}>
                      Dropped
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.dropped.toLocaleString()}
                    </Grid>
                    <Grid item xs={6} sx={style.statsTitle}>
                      Planned
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.planned.toLocaleString()}
                    </Grid>
                  </Grid>
                }
              >
                <Typography variant="h6" align="center">
                  <b>#{animeState.popularity.toLocaleString()}</b>
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <Divider sx={style.statsTitle}>Type</Divider>
              <Typography variant="h6" align="center">
                <b>{AnimeTypeToStr(animeState.type)}</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Divider sx={style.statsTitle}>Status</Divider>
              <Tooltip
                placement="left"
                arrow
                PopperProps={{ sx: style.dateTooltip }}
                title={
                  <Grid container spacing={1}>
                    <Grid item xs={6} sx={style.statsTitle}>
                      Episode Count
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.episode_count.toLocaleString()}
                    </Grid>
                    <Grid item xs={6} sx={style.statsTitle}>
                      Episode Duration
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.episode_duration}
                    </Grid>
                    {animeState.season !== '' && (
                      <>
                        <Grid item xs={6} sx={style.statsTitle}>
                          Season
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          {SeasonToStr(animeState.season)} {animeState.season_year}
                        </Grid>
                      </>
                    )}
                    {animeState.broadcast_day !== '' && (
                      <>
                        <Grid item xs={6} sx={style.statsTitle}>
                          Broadcast
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                          {DayToStr(animeState.broadcast_day)} {animeState.broadcast_time}
                        </Grid>
                      </>
                    )}
                    <Grid item xs={6} sx={style.statsTitle}>
                      Start Date
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.start_date || '-'}
                    </Grid>
                    <Grid item xs={6} sx={style.statsTitle}>
                      End Date
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.end_date || '-'}
                    </Grid>
                  </Grid>
                }
              >
                <Typography variant="h6" align="center">
                  <b>{AnimeStatusToStr(animeState.status)}</b>
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'justify' }}>
              <Divider sx={{ ...style.statsTitle, marginBottom: 1 }}>Synopsis</Divider>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{animeState.synopsis}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Divider sx={{ ...style.statsTitle, marginBottom: 1 }}>Genres</Divider>
              {animeState.genres.map((g) => {
                return <Chip size="small" label={g} key={g} sx={style.genreChip} />;
              })}
            </Grid>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12}>
                <Tooltip placement="left" arrow title={animeState.related.length.toLocaleString()}>
                  <Divider sx={{ ...style.statsTitle, marginBottom: 1 }}>Related</Divider>
                </Tooltip>
              </Grid>
              {Array.from(new Set(animeState.related.map((r) => r.relation))).map((r) => {
                return (
                  <React.Fragment key={r}>
                    <Grid item xs={3} sx={{ ...style.statsTitle, textAlign: 'right' }}>
                      <Tooltip
                        placement="left"
                        arrow
                        title={animeState.related.filter((a) => a.relation === r).length.toLocaleString()}
                      >
                        <span>{AnimeRelationToStr(r)}</span>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={9} container spacing={1}>
                      {animeState.related
                        .filter((a) => a.relation === r)
                        .map((r) => {
                          const n = nodes.find((n) => n.anime_id === r.id);
                          return (
                            <React.Fragment key={r.id}>
                              <Grid item xs={1}>
                                <StatusCircle
                                  status={n?.user_anime_status || ''}
                                  color={nodeColor[n?.user_anime_status || ''] || ''}
                                  sx={{ marginTop: 2 }}
                                />
                              </Grid>
                              <Grid item xs={11}>
                                <Link
                                  color="inherit"
                                  underline="hover"
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => handleOpenAnimeDrawer(r.id)}
                                >
                                  {r.title}
                                </Link>
                              </Grid>
                            </React.Fragment>
                          );
                        })}
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12}>
                <Tooltip placement="left" arrow title={animeState.extended_related.length.toLocaleString()}>
                  <Divider
                    sx={{ ...style.statsTitle, marginBottom: 1, cursor: 'pointer' }}
                    onClick={handleToggleShowExtendedRelation}
                  >
                    {showExtendedRelation ? (
                      <ExpandLessIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                    ) : (
                      <ExpandMoreIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                    )}{' '}
                    Extended Related{' '}
                    {showExtendedRelation ? (
                      <ExpandLessIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                    ) : (
                      <ExpandMoreIcon fontSize="small" sx={{ marginBottom: -0.5 }} />
                    )}
                  </Divider>
                </Tooltip>
              </Grid>
              {showExtendedRelation &&
                animeState.extended_related.map((r) => {
                  const n = nodes.find((n) => n.anime_id === r.id);
                  return (
                    <React.Fragment key={r.id}>
                      <Grid item xs={1} />
                      <Grid item xs={1}>
                        <StatusCircle
                          status={n?.user_anime_status || ''}
                          color={nodeColor[n?.user_anime_status || ''] || ''}
                          sx={{ marginTop: 2 }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <Link
                          color="inherit"
                          underline="hover"
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleOpenAnimeDrawer(r.id)}
                        >
                          {r.title}
                        </Link>
                      </Grid>
                    </React.Fragment>
                  );
                })}
            </Grid>
          </>
        )}
      </Grid>
      {animeDrawerState.open && (
        <AnimeDrawer
          open={animeDrawerState.open}
          anime_id={animeDrawerState.anime_id}
          onClose={handleCloseAnimeDrawer}
          nodes={nodes}
          nodeColor={nodeColor}
        />
      )}
    </Drawer>
  );
};

export default AnimeDrawer;

const SkeletonDrawer = () => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          <Skeleton />
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" width={340} height={480} sx={{ margin: 'auto' }} />
      </Grid>
      <Grid item xs={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ marginBottom: 1 }}>
          <Skeleton width={100} />
        </Divider>
        <Typography>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton width="60%" />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ marginBottom: 1 }}>
          <Skeleton width={100} />
        </Divider>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Skeleton variant="rectangular" width={60} />
          <Skeleton variant="rectangular" width={60} />
          <Skeleton variant="rectangular" width={60} />
        </Stack>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12}>
          <Divider>
            <Skeleton width={100} />
          </Divider>
        </Grid>
        <Grid item xs={3}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid item xs={9}>
          <Skeleton variant="rectangular" width="50%" />
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={9}>
          <Skeleton variant="rectangular" width="90%" />
        </Grid>
        <Grid item xs={3}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid item xs={9}>
          <Skeleton variant="rectangular" width="70%" />
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={9}>
          <Skeleton variant="rectangular" width="60%" />
        </Grid>
      </Grid>
    </>
  );
};
