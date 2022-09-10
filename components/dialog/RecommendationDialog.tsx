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
  Stack,
  Tooltip,
} from '@mui/material';
import * as React from 'react';
import { GraphLink, GraphNode } from '../../types/Types';
import CloseIcon from '@mui/icons-material/Close';
import SlideTransition from '../transition/SlideTransition';
import { theme } from '../theme';
import { AnimeRelation, AnimeStatus, UserAnimeStatus } from '../../utils/constant';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

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
  showAnimeDrawer,
}: {
  open: boolean;
  onClose: () => void;
  username: string;
  nodes: Array<GraphNode>;
  links: Array<GraphLink>;
  nodeColor: any;
  showAnimeDrawer: (anime_id: number, force: boolean) => void;
}) => {
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
      const node1 = nodes.find((n) => n.anime_id === l.source);
      const node2 = nodes.find((n) => n.anime_id === l.target);
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
      const node1 = nodes.find((n) => n.anime_id === l.source);
      const node2 = nodes.find((n) => n.anime_id === l.target);
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
      const node1 = nodes.find((n) => n.anime_id === l.source);
      const node2 = nodes.find((n) => n.anime_id === l.target);
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
      const node1 = nodes.find((n) => n.anime_id === l.source);
      const node2 = nodes.find((n) => n.anime_id === l.target);
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
        n.score >= minScore && n.user_anime_status !== UserAnimeStatus.completed && n.status === AnimeStatus.finished,
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const missingSideStory = Array.from(sideStory)
    .filter(
      (n: GraphNode) =>
        n.score >= minScore && n.user_anime_status !== UserAnimeStatus.completed && n.status === AnimeStatus.finished,
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const onHold = nodes
    .filter(
      (n) =>
        n.score >= minScore && n.user_anime_status === UserAnimeStatus.on_hold && n.status === AnimeStatus.finished,
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const plannedAired = nodes
    .filter(
      (n) =>
        n.score >= minScore && n.user_anime_status === UserAnimeStatus.planned && n.status === AnimeStatus.finished,
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const summary = Array.from(summaryFull)
    .filter(
      (n) =>
        n.score >= minScore && n.user_anime_status !== UserAnimeStatus.completed && n.status === AnimeStatus.finished,
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const other = Array.from(otherChar)
    .filter(
      (n) =>
        n.score >= minScore && n.user_anime_status !== UserAnimeStatus.completed && n.status === AnimeStatus.finished,
    )
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const mismatchEpisode = nodes
    .filter((n) => n.user_anime_status === UserAnimeStatus.completed && n.episode_count !== n.user_episode_count)
    .filter((n) => !hideInList || n.user_anime_status === '')
    .sort((a, b) => a.title.localeCompare(b.title));

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
              title="Missing Sequel or Prequel"
              data={missingSequelPrequel}
              nodeColor={nodeColor}
              showAnimeDrawer={showAnimeDrawer}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <RecommendationGrid
              title="Missing Side Story or Alternative Story"
              data={missingSideStory}
              nodeColor={nodeColor}
              showAnimeDrawer={showAnimeDrawer}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <RecommendationGrid title="On Hold" data={onHold} nodeColor={nodeColor} showAnimeDrawer={showAnimeDrawer} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <RecommendationGrid
              title="Planned & Already Aired"
              data={plannedAired}
              nodeColor={nodeColor}
              showAnimeDrawer={showAnimeDrawer}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <RecommendationGrid
              title="Summary or Full Story"
              data={summary}
              nodeColor={nodeColor}
              showAnimeDrawer={showAnimeDrawer}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <RecommendationGrid
              title="Other Relation"
              data={other}
              nodeColor={nodeColor}
              showAnimeDrawer={showAnimeDrawer}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={4}>
            <RecommendationGrid
              title="Mismatched Episode Count"
              data={mismatchEpisode}
              nodeColor={nodeColor}
              showAnimeDrawer={showAnimeDrawer}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationDialog;

const StatusColor = ({
  status,
  color,
  sx,
}: {
  status: string;
  color: string;
  sx?: React.CSSProperties | undefined;
}) => {
  switch (status) {
    case UserAnimeStatus.watching:
      return (
        <Tooltip placement="left" arrow title="You are watching this">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.completed:
      return (
        <Tooltip placement="left" arrow title="You have completed this">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.on_hold:
      return (
        <Tooltip placement="left" arrow title="You put this on hold">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.dropped:
      return (
        <Tooltip placement="left" arrow title="You have dropped this">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    case UserAnimeStatus.planned:
      return (
        <Tooltip placement="left" arrow title="You are planning to watch this">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
    default:
      return (
        <Tooltip placement="left" arrow title="Not in your list">
          <div style={{ ...style.statusCircle, ...sx, background: color }} />
        </Tooltip>
      );
  }
};

const RecommendationGrid = ({
  title,
  data,
  nodeColor,
  showAnimeDrawer,
}: {
  title: string;
  data: Array<GraphNode>;
  nodeColor: any;
  showAnimeDrawer: (anime_id: number, force: boolean) => void;
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
                <StatusColor status={n.user_anime_status} color={nodeColor[n.user_anime_status]} />
              </Grid>
              <Grid item xs={11}>
                <Link
                  color="inherit"
                  underline="hover"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => showAnimeDrawer(n.id, true)}
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
