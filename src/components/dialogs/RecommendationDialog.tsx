import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { Fragment, memo, useState } from 'react';
import StatusCircle from '@/src/components/circles/StatusCircle';
import { useCtx } from '@/src/components/context';
import { Node } from '@/src/components/graphs/types';
import theme from '@/src/components/theme';
import SlideTransition from '@/src/components/transitions/SliceTransition';
import { AnimeRelation, AnimeStatus, UserAnimeStatus } from '@/src/libs/constant';
import { getNodeMap } from '@/src/libs/graph';

const styles = {
  dialogPaper: {
    backgroundImage: 'radial-gradient(rgb(65, 65, 65) 0.5px, #121212 0.5px)',
    backgroundSize: '15px 15px',
  },
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

const RecommendationDialog = memo(function RecommendationDialog({
  open,
  toggleOpen,
}: {
  open: boolean;
  toggleOpen: () => void;
}) {
  const ctx = useCtx();

  const [hideInList, setHideInList] = useState(false);
  const [minScore, setMinScore] = useState(7);

  const nodeMap = getNodeMap(ctx.graphData.nodes);

  const sequelPrequel = new Set<number>();
  const sideStory = new Set<number>();
  const summaryFull = new Set<number>();
  const otherChar = new Set<number>();

  ctx.graphData.links.forEach((l) => {
    const node1 = nodeMap.get(l.sourceID);
    const node2 = nodeMap.get(l.targetID);
    switch (l.relation) {
      case AnimeRelation.sequel:
      case AnimeRelation.prequel:
        if (node1 && node2) {
          if (
            node1.userAnimeStatus === UserAnimeStatus.completed &&
            node2.userAnimeStatus !== UserAnimeStatus.completed
          ) {
            sequelPrequel.add(node2.id);
          }
          if (
            node1.userAnimeStatus !== UserAnimeStatus.completed &&
            node2.userAnimeStatus === UserAnimeStatus.completed
          ) {
            sequelPrequel.add(node1.id);
          }
        }
        break;
      case AnimeRelation.alternativeSetting:
      case AnimeRelation.alternativeVersion:
      case AnimeRelation.sideStory:
      case AnimeRelation.parentStory:
      case AnimeRelation.spinOff:
      case AnimeRelation.adaptation:
        if (node1 && node2) {
          if (
            node1.userAnimeStatus === UserAnimeStatus.completed &&
            node2.userAnimeStatus !== UserAnimeStatus.completed
          ) {
            sideStory.add(node2.id);
          }
          if (
            node1.userAnimeStatus !== UserAnimeStatus.completed &&
            node2.userAnimeStatus === UserAnimeStatus.completed
          ) {
            sideStory.add(node1.id);
          }
        }
        break;
      case AnimeRelation.summary:
      case AnimeRelation.fullStory:
        if (node1 && node2) {
          if (
            node1.userAnimeStatus === UserAnimeStatus.completed &&
            node2.userAnimeStatus !== UserAnimeStatus.completed
          ) {
            summaryFull.add(node2.id);
          }
          if (
            node1.userAnimeStatus !== UserAnimeStatus.completed &&
            node2.userAnimeStatus === UserAnimeStatus.completed
          ) {
            summaryFull.add(node1.id);
          }
        }
        break;
      case AnimeRelation.character:
      case AnimeRelation.other:
        if (node1 && node2) {
          if (
            node1.userAnimeStatus === UserAnimeStatus.completed &&
            node2.userAnimeStatus !== UserAnimeStatus.completed
          ) {
            otherChar.add(node2.id);
          }
          if (
            node1.userAnimeStatus !== UserAnimeStatus.completed &&
            node2.userAnimeStatus === UserAnimeStatus.completed
          ) {
            otherChar.add(node1.id);
          }
        }
    }
  });

  const missingSequelPrequel = ctx.graphData.nodes
    .filter((n) => sequelPrequel.has(n.id))
    .filter(
      (n) =>
        n.score >= minScore &&
        n.userAnimeStatus !== UserAnimeStatus.completed &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.userAnimeStatus === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const missingSideStory = ctx.graphData.nodes
    .filter((n) => sideStory.has(n.id))
    .filter(
      (n) =>
        n.score >= minScore &&
        n.userAnimeStatus !== UserAnimeStatus.completed &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.userAnimeStatus === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const onHold = ctx.graphData.nodes
    .filter(
      (n) =>
        n.score >= minScore &&
        n.userAnimeStatus === UserAnimeStatus.onHold &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.userAnimeStatus === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const plannedAired = ctx.graphData.nodes
    .filter(
      (n) =>
        n.score >= minScore &&
        n.userAnimeStatus === UserAnimeStatus.planned &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.userAnimeStatus === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const summary = ctx.graphData.nodes
    .filter((n) => summaryFull.has(n.id))
    .filter(
      (n) =>
        n.score >= minScore &&
        n.userAnimeStatus !== UserAnimeStatus.completed &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.userAnimeStatus === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const other = ctx.graphData.nodes
    .filter((n) => otherChar.has(n.id))
    .filter(
      (n) =>
        n.score >= minScore &&
        n.userAnimeStatus !== UserAnimeStatus.completed &&
        (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing),
    )
    .filter((n) => !hideInList || n.userAnimeStatus === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const mismatchEpisode = ctx.graphData.nodes
    .filter((n) => n.userAnimeStatus === UserAnimeStatus.completed && n.episodeCount !== n.userEpisodeCount)
    .filter((n) => !hideInList || n.userAnimeStatus === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const completedZero = ctx.graphData.nodes
    .filter((n) => n.userAnimeStatus === UserAnimeStatus.completed && n.userAnimeScore === 0)
    .filter((n) => !hideInList || n.userAnimeStatus === '')
    .sort((a, b) => a.title.localeCompare(b.title));

  const toggleHideInList = () => {
    setHideInList(!hideInList);
  };

  const onChangeScore = (e: SelectChangeEvent<any>) => {
    setMinScore(e.target.value);
  };

  return (
    <Dialog
      open={open}
      fullScreen
      slots={{ transition: SlideTransition }}
      slotProps={{ paper: { sx: styles.dialogPaper } }}
    >
      <DialogTitle>
        <Grid container spacing={2}>
          <Grid>{`${ctx.username}'s Recommendations`}</Grid>
          <Grid size="grow" />
          <Grid>
            <Tooltip title={hideInList ? 'includes already in list' : 'hide already in list'} placement="left" arrow>
              <IconButton onClick={toggleHideInList} size="small">
                {hideInList ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid>
            <FormControl size="small" sx={{ width: 100 }}>
              <InputLabel id="filterScore-select">Min Score</InputLabel>
              <Select id="filterScore-select" label="Min Score" value={minScore} onChange={onChangeScore}>
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
                  )
                  .reverse()}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <IconButton onClick={toggleOpen} size="small">
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
            <RecommendationGrid title="Sequel or Prequel" data={missingSequelPrequel} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
            <RecommendationGrid title="Side Story or Alternative Story" data={missingSideStory} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
            <RecommendationGrid title="On Hold" data={onHold} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
            <RecommendationGrid title="Planned & Already Aired" data={plannedAired} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
            <RecommendationGrid title="Summary or Full Story" data={summary} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
            <RecommendationGrid title="Other Relation" data={other} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
            <RecommendationGrid title="Mismatched Episode Count" data={mismatchEpisode} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
            <RecommendationGrid title="Completed but No Score" data={completedZero} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});

export default RecommendationDialog;

const RecommendationGrid = ({ title, data }: { title: string; data: Node[] }) => {
  const ctx = useCtx();

  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 10, lg: 11 }}>
        <Divider sx={styles.title}>
          {title} ({data.length.toLocaleString()})
        </Divider>
      </Grid>
      <Grid size={{ xs: 2, lg: 1 }}>
        <Tooltip title={open ? 'hide list' : 'show list'} placement="left" arrow>
          <IconButton onClick={toggleOpen} size="small">
            {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid size={12}>
        <Collapse in={open}>
          <Grid container spacing={2}>
            {data.length === 0 ? (
              <>
                <Grid size={1} sx={{ textAlign: 'center' }}>
                  <ThumbUpAltIcon />
                </Grid>
                <Grid size={11} sx={{ textAlign: 'left' }}>
                  None. Good job.
                </Grid>
              </>
            ) : (
              data.map((n) => (
                <Fragment key={n.id}>
                  <Grid size={1}>
                    <StatusCircle status={n.userAnimeStatus} />
                  </Grid>
                  <Grid size={11}>
                    <Link
                      color="inherit"
                      underline="hover"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => ctx.onOpenDrawer(n.id)}
                    >
                      {n.title}
                    </Link>
                  </Grid>
                </Fragment>
              ))
            )}
          </Grid>
        </Collapse>
      </Grid>
    </Grid>
  );
};
