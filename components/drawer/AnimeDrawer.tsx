import * as React from 'react';
import { Chip, Divider, Drawer, Grid, IconButton, Link, Tooltip, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLefttIcon from '@mui/icons-material/ChevronLeft';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AnimeDrawerData, Genre, GraphNode } from '../../types/Types';
import axios from 'axios';
import { theme } from '../theme';
import { DateToStr, PrintDate } from '../../utils/utils';
import { AnimeStatusToStr, AnimeTypeToStr, UserAnimeStatus } from '../../utils/constant';

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
  dateTooltip: {
    '& .MuiTooltip-tooltip': {
      padding: 2,
      background: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      maxWidth: 'none',
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
  genreChip: {
    margin: 0.5,
  },
};

const AnimeDrawer = ({
  open,
  anime_id,
  onClose,
  node,
  nodeColor,
}: {
  open: boolean;
  anime_id: number;
  onClose: any;
  node: GraphNode | undefined;
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
    genres: [],
    loading: false,
    error: '',
  });

  React.useEffect(() => {
    if (!anime_id || anime_id === 0) {
      setAnimeState({ ...animeState, loading: false, error: 'empty id' });
      return;
    }

    setAnimeState({ ...animeState, loading: true, error: '' });

    axios
      .get(`/api/anime/${anime_id}`)
      .then((resp) => {
        const anime = resp.data.data;

        setAnimeState({
          ...animeState,
          id: anime.id,
          title: anime.title,
          title_synonyms: anime.alternative_titles.synonyms,
          title_english: anime.alternative_titles.english,
          title_japanese: anime.alternative_titles.japanese,
          pictures: Array.from(new Set([anime.picture].concat(anime.pictures))),
          synopsis: anime.synopsis,
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
          genres: anime.genres.map((g: Genre) => g.name),
          loading: false,
          error: '',
        });
        setPictureState(0);
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

  return (
    <Drawer open={open} anchor="right" variant="persistent" PaperProps={{ sx: style.drawer }}>
      <Grid container spacing={2}>
        <Grid item xs={12} container>
          <Grid item>
            <Tooltip title="Close" placement="right" arrow>
              <IconButton onClick={onClose}>
                {open ? <ChevronRightIcon /> : <ChevronLefttIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs />
          <Grid item>
            <StatusColor
              status={node?.user_anime_status || ''}
              color={nodeColor[node?.user_anime_status || ''] || ''}
            />
          </Grid>
        </Grid>
        {animeState.error !== '' ? (
          <Grid item xs={12}>
            {animeState.error}
          </Grid>
        ) : animeState.loading ? (
          <Grid item xs={12}>
            loading...
          </Grid>
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
                        <Grid item xs={12} container>
                          <Grid item xs={3}>
                            <Typography variant="subtitle2">Synonym</Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography>{animeState.title_synonyms.join(', ')}</Typography>
                          </Grid>
                        </Grid>
                      )}
                      {animeState.title_english !== '' && (
                        <Grid item xs={12} container>
                          <Grid item xs={3}>
                            <Typography variant="subtitle2">English</Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography>{animeState.title_english}</Typography>
                          </Grid>
                        </Grid>
                      )}
                      {animeState.title_japanese !== '' && (
                        <Grid item xs={12} container>
                          <Grid item xs={3}>
                            <Typography variant="subtitle2">Japanese</Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography>{animeState.title_japanese}</Typography>
                          </Grid>
                        </Grid>
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
              <img
                src={animeState.pictures[pictureState]}
                alt={animeState.title}
                style={style.image}
              />
              <IconButton
                onClick={handlePrevPicture}
                disabled={pictureState <= 0}
                sx={style.picturePrevButton}
              >
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
              <Divider>Rank</Divider>
              <Typography variant="h6" align="center">
                <b>#{animeState.rank.toLocaleString()}</b>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Divider>Score</Divider>
              <Tooltip
                placement="bottom"
                arrow
                PopperProps={{ sx: style.dateTooltip }}
                title={!node?.user_anime_status ? '' : `Your score: ${node?.user_anime_score}`}
              >
                <Typography variant="h6" align="center">
                  <b>{animeState.mean.toLocaleString()}</b>
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={4}>
              <Divider>Popularity</Divider>
              <Tooltip
                placement="bottom"
                arrow
                PopperProps={{ sx: style.statsTooltip }}
                title={
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      Watching
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.watching.toLocaleString()}
                    </Grid>
                    <Grid item xs={6}>
                      Completed
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.completed.toLocaleString()}
                    </Grid>
                    <Grid item xs={6}>
                      On Hold
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.on_hold.toLocaleString()}
                    </Grid>
                    <Grid item xs={6}>
                      Dropped
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      {animeState.stats.dropped.toLocaleString()}
                    </Grid>
                    <Grid item xs={6}>
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
              <Divider>Type</Divider>
              <Typography variant="h6" align="center">
                <b>{AnimeTypeToStr(animeState.type)}</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Divider>Status</Divider>
              <Tooltip
                placement="bottom"
                arrow
                PopperProps={{ sx: style.dateTooltip }}
                title={PrintDate(animeState.start_date, animeState.end_date)}
              >
                <Typography variant="h6" align="center">
                  <b>{AnimeStatusToStr(animeState.status)}</b>
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'justify' }}>
              <Divider sx={{ marginBottom: 1 }}>Synopsis</Divider>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{animeState.synopsis}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Divider sx={{ marginBottom: 1 }}>Genres</Divider>
              {animeState.genres.map((g) => {
                return <Chip size="small" label={g} key={g} sx={style.genreChip} />;
              })}
            </Grid>
          </>
        )}
      </Grid>
    </Drawer>
  );
};

export default AnimeDrawer;

const StatusColor = ({ status, color }: { status: string; color: string }) => {
  switch (status) {
    case UserAnimeStatus.watching:
      return (
        <Tooltip placement="left" arrow title="You are watching this">
          <div style={{ ...style.statusCircle, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.completed:
      return (
        <Tooltip placement="left" arrow title="You have completed this">
          <div style={{ ...style.statusCircle, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.on_hold:
      return (
        <Tooltip placement="left" arrow title="You put this on hold">
          <div style={{ ...style.statusCircle, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.dropped:
      return (
        <Tooltip placement="left" arrow title="You have dropped this">
          <div style={{ ...style.statusCircle, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.planned:
      return (
        <Tooltip placement="left" arrow title="You are planning to watch this">
          <div style={{ ...style.statusCircle, background: color }} />
        </Tooltip>
      );
    default:
      return (
        <Tooltip placement="left" arrow title="Not in your list">
          <div style={{ ...style.statusCircle, background: color }} />
        </Tooltip>
      );
  }
};
