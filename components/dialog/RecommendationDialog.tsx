import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import * as React from 'react';
import { AnimeDrawerState, GraphLink, GraphNode } from '../../types/Types';
import CloseIcon from '@mui/icons-material/Close';
import SlideTransition from '../transition/SlideTransition';
import { theme } from '../theme';
import { AnimeRelation, AnimeStatus, UserAnimeStatus } from '../../utils/constant';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import StatusCircle from '../circle/StatusCircle';
import AnimeDrawer from '../drawer/AnimeDrawer';

const style = {
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '1px solid white',
    margin: 'auto',
  },
  title: {
    color: theme.palette.grey[500],
  },
};

const RecommendationDialog = ({
  open,
  onClose,
  username,
  nodes = [],
  links = [],
  nodeColor,
}: {
  open: boolean;
  onClose: () => void;
  username: string;
  nodes: Array<GraphNode>;
  links: Array<GraphLink>;
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

  const [minScore, setMinScore] = React.useState(7);

  const handleChangeScore = (e: SelectChangeEvent<any>) => {
    setMinScore(e.target.value);
  };

  const [hideInList, setHideInList] = React.useState(false);

  const toggleHideInList = () => {
    setHideInList(!hideInList);
  };

  var sequelPrequel = new Set<GraphNode>();
  var sideStory = new Set<GraphNode>();
  var summaryFull = new Set<GraphNode>();
  var otherChar = new Set<GraphNode>();

  links.forEach((l) => {
    if (l.relation === AnimeRelation.sequel || l.relation === AnimeRelation.prequel) {
      const node1 = nodes.find((n) => n.anime_id === l.sourceID);
      const node2 = nodes.find((n) => n.anime_id === l.targetID);
      if (node1 && node2) {
        if (
          node1.user_anime_status === UserAnimeStatus.completed &&
          node2.user_anime_status !== UserAnimeStatus.completed &&
          !sequelPrequel.has(node2)
        ) {
          sequelPrequel.add(node2);
        }
        if (
          node1.user_anime_status !== UserAnimeStatus.completed &&
          node2.user_anime_status === UserAnimeStatus.completed &&
          !sequelPrequel.has(node1)
        ) {
          sequelPrequel.add(node1);
        }
      }
    }

    if (
      l.relation === AnimeRelation.alternative_setting ||
      l.relation === AnimeRelation.alternative_version ||
      l.relation === AnimeRelation.side_story ||
      l.relation === AnimeRelation.parent_story ||
      l.relation === AnimeRelation.spin_off ||
      l.relation === AnimeRelation.adaptation
    ) {
      const node1 = nodes.find((n) => n.anime_id === l.sourceID);
      const node2 = nodes.find((n) => n.anime_id === l.targetID);
      if (node1 && node2) {
        if (
          node1.user_anime_status === UserAnimeStatus.completed &&
          node2.user_anime_status !== UserAnimeStatus.completed &&
          !sideStory.has(node2)
        ) {
          sideStory.add(node2);
        }
        if (
          node1.user_anime_status !== UserAnimeStatus.completed &&
          node2.user_anime_status === UserAnimeStatus.completed &&
          !sideStory.has(node1)
        ) {
          sideStory.add(node1);
        }
      }
    }

    if (l.relation === AnimeRelation.summary || l.relation === AnimeRelation.full_story) {
      const node1 = nodes.find((n) => n.anime_id === l.sourceID);
      const node2 = nodes.find((n) => n.anime_id === l.targetID);
      if (node1 && node2) {
        if (
          node1.user_anime_status === UserAnimeStatus.completed &&
          node2.user_anime_status !== UserAnimeStatus.completed &&
          !summaryFull.has(node2)
        ) {
          summaryFull.add(node2);
        }
        if (
          node1.user_anime_status !== UserAnimeStatus.completed &&
          node2.user_anime_status === UserAnimeStatus.completed &&
          !summaryFull.has(node1)
        ) {
          summaryFull.add(node1);
        }
      }
    }

    if (l.relation === AnimeRelation.character || l.relation === AnimeRelation.other) {
      const node1 = nodes.find((n) => n.anime_id === l.sourceID);
      const node2 = nodes.find((n) => n.anime_id === l.targetID);
      if (node1 && node2) {
        if (
          node1.user_anime_status === UserAnimeStatus.completed &&
          node2.user_anime_status !== UserAnimeStatus.completed &&
          !otherChar.has(node2)
        ) {
          otherChar.add(node2);
        }
        if (
          node1.user_anime_status !== UserAnimeStatus.completed &&
          node2.user_anime_status === UserAnimeStatus.completed &&
          !otherChar.has(node1)
        ) {
          otherChar.add(node1);
        }
      }
    }
  });

  const missingSequelPrequel = Array.from(sequelPrequel)
    .filter(
      (n: GraphNode) =>
        n.score >= minScore &&
        n.user_anime_status !== UserAnimeStatus.completed &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const missingSideStory = Array.from(sideStory)
    .filter(
      (n: GraphNode) =>
        n.score >= minScore &&
        n.user_anime_status !== UserAnimeStatus.completed &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const onHold = nodes
    .filter(
      (n) =>
        n.score >= minScore &&
        n.user_anime_status === UserAnimeStatus.on_hold &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const plannedAired = nodes
    .filter(
      (n) =>
        n.score >= minScore &&
        n.user_anime_status === UserAnimeStatus.planned &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const summary = Array.from(summaryFull)
    .filter(
      (n) =>
        n.score >= minScore &&
        n.user_anime_status !== UserAnimeStatus.completed &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const other = Array.from(otherChar)
    .filter(
      (n) =>
        n.score >= minScore &&
        n.user_anime_status !== UserAnimeStatus.completed &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const mismatchEpisode = nodes
    .filter((n) => n.user_anime_status === UserAnimeStatus.completed && n.episode_count !== n.user_episode_count)
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const completedZero = nodes
    .filter((n) => n.user_anime_status === UserAnimeStatus.completed && n.user_anime_score === 0)
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
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
          <Grid container spacing={2}>
            <Grid item>{`${username}'s Recommendations`}</Grid>
            <Grid item xs />
            <Grid item>
              <Tooltip title={hideInList ? 'includes already in list' : 'hide already in list'} placement="left" arrow>
                <IconButton onClick={toggleHideInList} size="small">
                  {hideInList ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <FormControl size="small" sx={{ width: 100 }}>
                <InputLabel id="filterScore-select">Min Score</InputLabel>
                <Select id="filterScore-select" label="Min Score" value={minScore} onChange={handleChangeScore}>
                  <MenuItem value="0">All</MenuItem>
                  {Array(11)
                    .fill(0)
                    .map(
                      (_, i) =>
                        i > 0 && (
                          <MenuItem value={i} key={i}>
                            {i}
                          </MenuItem>
                        ),
                    )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} xl={4}>
              <RecommendationGrid
                title="Sequel or Prequel"
                data={missingSequelPrequel}
                nodeColor={nodeColor}
                showAnimeDrawer={handleOpenAnimeDrawer}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={4}>
              <RecommendationGrid
                title="Side Story or Alternative Story"
                data={missingSideStory}
                nodeColor={nodeColor}
                showAnimeDrawer={handleOpenAnimeDrawer}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={4}>
              <RecommendationGrid
                title="On Hold"
                data={onHold}
                nodeColor={nodeColor}
                showAnimeDrawer={handleOpenAnimeDrawer}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={4}>
              <RecommendationGrid
                title="Planned & Already Aired"
                data={plannedAired}
                nodeColor={nodeColor}
                showAnimeDrawer={handleOpenAnimeDrawer}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={4}>
              <RecommendationGrid
                title="Summary or Full Story"
                data={summary}
                nodeColor={nodeColor}
                showAnimeDrawer={handleOpenAnimeDrawer}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={4}>
              <RecommendationGrid
                title="Other Relation"
                data={other}
                nodeColor={nodeColor}
                showAnimeDrawer={handleOpenAnimeDrawer}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={4}>
              <RecommendationGrid
                title="Mismatched Episode Count"
                data={mismatchEpisode}
                nodeColor={nodeColor}
                showAnimeDrawer={handleOpenAnimeDrawer}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={4}>
              <RecommendationGrid
                title="Completed but No Score"
                data={completedZero}
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
    </>
  );
};

export default RecommendationDialog;

const RecommendationGrid = ({
  title,
  data,
  nodeColor,
  showAnimeDrawer,
}: {
  title: string;
  data: Array<GraphNode>;
  nodeColor: any;
  showAnimeDrawer: (anime_id: number) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={10} lg={11}>
        <Divider sx={style.title}>
          {title} ({data.length.toLocaleString()})
        </Divider>
      </Grid>
      <Grid item xs={2} lg={1}>
        <Tooltip title={open ? 'hide list' : 'show list'} placement="left" arrow>
          <IconButton onClick={toggleOpen} size="small">
            {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Grid>
      {open &&
        (data.length === 0 ? (
          <>
            <Grid item xs={1} sx={{ textAlign: 'center' }}>
              <ThumbUpAltIcon />
            </Grid>
            <Grid item xs={11} sx={{ textAlign: 'left' }}>
              None. Good job.
            </Grid>
          </>
        ) : (
          data.map((n) => (
            <React.Fragment key={n.anime_id}>
              <Grid item xs={1}>
                <StatusCircle status={n.user_anime_status} color={nodeColor[n.user_anime_status]} />
              </Grid>
              <Grid item xs={11}>
                <Link
                  color="inherit"
                  underline="hover"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => showAnimeDrawer(n.id)}
                >
                  {n.title}
                </Link>
              </Grid>
            </React.Fragment>
          ))
        ))}
    </Grid>
  );
};
