import StatusCircle from "../circles/StatusCircle";
import { useCtx } from "../context";
import AnimeDrawer from "../drawers/AnimeDrawer";
import { AnimeDrawerRefType } from "../drawers/types";
import { Node } from "../graphs/types";
import { theme } from "../theme";
import SlideTransition from "../transitions/SlideTransition";
import { AnimeRelation, AnimeStatus, UserAnimeStatus } from "@/libs/constant";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import { Fragment, forwardRef, memo, useImperativeHandle, useRef, useState } from "react";

const RecommendationDialog = memo(
  forwardRef((_, ref) => {
    const ctx = useCtx();
    const drawerRef = useRef<AnimeDrawerRefType>(null);

    const [open, setOpen] = useState(false);
    const [drawerAnimeID, setDrawerAnimeID] = useState(0);
    const [hideInList, setHideInList] = useState(false);
    const [minScore, setMinScore] = useState(7);

    let sequelPrequel = new Set<Node>();
    let sideStory = new Set<Node>();
    let summaryFull = new Set<Node>();
    let otherChar = new Set<Node>();

    ctx.graph.links.forEach((l) => {
      if (l.relation === AnimeRelation.sequel || l.relation === AnimeRelation.prequel) {
        const node1 = ctx.graph.nodes.find((n) => n.animeID === l.sourceID);
        const node2 = ctx.graph.nodes.find((n) => n.animeID === l.targetID);
        if (node1 && node2) {
          if (
            node1.userAnimeStatus === UserAnimeStatus.completed &&
            node2.userAnimeStatus !== UserAnimeStatus.completed &&
            !sequelPrequel.has(node2)
          ) {
            sequelPrequel.add(node2);
          }
          if (
            node1.userAnimeStatus !== UserAnimeStatus.completed &&
            node2.userAnimeStatus === UserAnimeStatus.completed &&
            !sequelPrequel.has(node1)
          ) {
            sequelPrequel.add(node1);
          }
        }
      }

      if (
        l.relation === AnimeRelation.alternativeSetting ||
        l.relation === AnimeRelation.alternativeVersion ||
        l.relation === AnimeRelation.sideStory ||
        l.relation === AnimeRelation.parentStory ||
        l.relation === AnimeRelation.spinOff ||
        l.relation === AnimeRelation.adaptation
      ) {
        const node1 = ctx.graph.nodes.find((n) => n.animeID === l.sourceID);
        const node2 = ctx.graph.nodes.find((n) => n.animeID === l.targetID);
        if (node1 && node2) {
          if (
            node1.userAnimeStatus === UserAnimeStatus.completed &&
            node2.userAnimeStatus !== UserAnimeStatus.completed &&
            !sideStory.has(node2)
          ) {
            sideStory.add(node2);
          }
          if (
            node1.userAnimeStatus !== UserAnimeStatus.completed &&
            node2.userAnimeStatus === UserAnimeStatus.completed &&
            !sideStory.has(node1)
          ) {
            sideStory.add(node1);
          }
        }
      }

      if (l.relation === AnimeRelation.summary || l.relation === AnimeRelation.fullStory) {
        const node1 = ctx.graph.nodes.find((n) => n.animeID === l.sourceID);
        const node2 = ctx.graph.nodes.find((n) => n.animeID === l.targetID);
        if (node1 && node2) {
          if (
            node1.userAnimeStatus === UserAnimeStatus.completed &&
            node2.userAnimeStatus !== UserAnimeStatus.completed &&
            !summaryFull.has(node2)
          ) {
            summaryFull.add(node2);
          }
          if (
            node1.userAnimeStatus !== UserAnimeStatus.completed &&
            node2.userAnimeStatus === UserAnimeStatus.completed &&
            !summaryFull.has(node1)
          ) {
            summaryFull.add(node1);
          }
        }
      }

      if (l.relation === AnimeRelation.character || l.relation === AnimeRelation.other) {
        const node1 = ctx.graph.nodes.find((n) => n.animeID === l.sourceID);
        const node2 = ctx.graph.nodes.find((n) => n.animeID === l.targetID);
        if (node1 && node2) {
          if (
            node1.userAnimeStatus === UserAnimeStatus.completed &&
            node2.userAnimeStatus !== UserAnimeStatus.completed &&
            !otherChar.has(node2)
          ) {
            otherChar.add(node2);
          }
          if (
            node1.userAnimeStatus !== UserAnimeStatus.completed &&
            node2.userAnimeStatus === UserAnimeStatus.completed &&
            !otherChar.has(node1)
          ) {
            otherChar.add(node1);
          }
        }
      }
    });

    const missingSequelPrequel = Array.from(sequelPrequel)
      .filter(
        (n) =>
          n.score >= minScore &&
          n.userAnimeStatus !== UserAnimeStatus.completed &&
          (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing)
      )
      .filter((n) => !hideInList || n.userAnimeStatus === "")
      .sort((a, b) => a.title.localeCompare(b.title));

    const missingSideStory = Array.from(sideStory)
      .filter(
        (n) =>
          n.score >= minScore &&
          n.userAnimeStatus !== UserAnimeStatus.completed &&
          (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing)
      )
      .filter((n) => !hideInList || n.userAnimeStatus === "")
      .sort((a, b) => a.title.localeCompare(b.title));

    const onHold = ctx.graph.nodes
      .filter(
        (n) =>
          n.score >= minScore &&
          n.userAnimeStatus === UserAnimeStatus.onHold &&
          (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing)
      )
      .filter((n) => !hideInList || n.userAnimeStatus === "")
      .sort((a, b) => a.title.localeCompare(b.title));

    const plannedAired = ctx.graph.nodes
      .filter(
        (n) =>
          n.score >= minScore &&
          n.userAnimeStatus === UserAnimeStatus.planned &&
          (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing)
      )
      .filter((n) => !hideInList || n.userAnimeStatus === "")
      .sort((a, b) => a.title.localeCompare(b.title));

    const summary = Array.from(summaryFull)
      .filter(
        (n) =>
          n.score >= minScore &&
          n.userAnimeStatus !== UserAnimeStatus.completed &&
          (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing)
      )
      .filter((n) => !hideInList || n.userAnimeStatus === "")
      .sort((a, b) => a.title.localeCompare(b.title));

    const other = Array.from(otherChar)
      .filter(
        (n) =>
          n.score >= minScore &&
          n.userAnimeStatus !== UserAnimeStatus.completed &&
          (n.status === AnimeStatus.finished || n.status === AnimeStatus.releasing)
      )
      .filter((n) => !hideInList || n.userAnimeStatus === "")
      .sort((a, b) => a.title.localeCompare(b.title));

    const mismatchEpisode = ctx.graph.nodes
      .filter((n) => n.userAnimeStatus === UserAnimeStatus.completed && n.episodeCount !== n.userEpisodeCount)
      .filter((n) => !hideInList || n.userAnimeStatus === "")
      .sort((a, b) => a.title.localeCompare(b.title));

    const completedZero = ctx.graph.nodes
      .filter((n) => n.userAnimeStatus === UserAnimeStatus.completed && n.userAnimeScore === 0)
      .filter((n) => !hideInList || n.userAnimeStatus === "")
      .sort((a, b) => a.title.localeCompare(b.title));

    const onClose = () => {
      setOpen(false);
    };

    const toggleHideInList = () => {
      setHideInList(!hideInList);
    };

    const onChangeScore = (e: SelectChangeEvent<any>) => {
      setMinScore(e.target.value);
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
            <Grid container spacing={2}>
              <Grid>{`${ctx.username}'s Recommendations`}</Grid>
              <Grid size="grow" />
              <Grid>
                <Tooltip
                  title={hideInList ? "includes already in list" : "hide already in list"}
                  placement="left"
                  arrow
                >
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
                          )
                      )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <RecommendationGrid title="Sequel or Prequel" data={missingSequelPrequel} onClickAnime={onClickAnime} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <RecommendationGrid
                  title="Side Story or Alternative Story"
                  data={missingSideStory}
                  onClickAnime={onClickAnime}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <RecommendationGrid title="On Hold" data={onHold} onClickAnime={onClickAnime} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <RecommendationGrid title="Planned & Already Aired" data={plannedAired} onClickAnime={onClickAnime} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <RecommendationGrid title="Summary or Full Story" data={summary} onClickAnime={onClickAnime} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <RecommendationGrid title="Other Relation" data={other} onClickAnime={onClickAnime} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <RecommendationGrid
                  title="Mismatched Episode Count"
                  data={mismatchEpisode}
                  onClickAnime={onClickAnime}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                <RecommendationGrid title="Completed but No Score" data={completedZero} onClickAnime={onClickAnime} />
              </Grid>
            </Grid>
          </DialogContent>
          <AnimeDrawer ref={drawerRef} animeID={drawerAnimeID} />
        </Dialog>
      </>
    );
  })
);

export default RecommendationDialog;

const style = {
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "1px solid white",
    margin: "auto",
  },
  title: {
    color: theme.palette.grey[500],
  },
};

const RecommendationGrid = ({
  title,
  data,
  onClickAnime,
}: {
  title: string;
  data: Node[];
  onClickAnime: (animeID: number) => void;
}) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 10, lg: 11 }}>
        <Divider sx={style.title}>
          {title} ({data.length.toLocaleString()})
        </Divider>
      </Grid>
      <Grid size={{ xs: 2, lg: 1 }}>
        <Tooltip title={open ? "hide list" : "show list"} placement="left" arrow>
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
                <Grid size={1} sx={{ textAlign: "center" }}>
                  <ThumbUpAltIcon />
                </Grid>
                <Grid size={11} sx={{ textAlign: "left" }}>
                  None. Good job.
                </Grid>
              </>
            ) : (
              data.map((n) => (
                <Fragment key={n.animeID}>
                  <Grid size={1}>
                    <StatusCircle status={n.userAnimeStatus} />
                  </Grid>
                  <Grid size={11}>
                    <Link
                      color="inherit"
                      underline="hover"
                      sx={{ cursor: "pointer" }}
                      onClick={() => onClickAnime(n.id)}
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
