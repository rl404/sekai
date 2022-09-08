import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  PaperProps,
  TextField,
  Tooltip,
} from '@mui/material';
import * as React from 'react';
import Draggable from 'react-draggable';
import { ConfigState, GraphData, ListDialogState, StatsDialogState } from '../../types/Types';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UserAnimeStatus } from '../../utils/constant';
import { SketchPicker } from 'react-color';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { theme } from '../theme';
import ListDialog from './ListDialog';
import StatsDialog from './StatsDialog';
import GrowTransition from '../transition/GrowTransition';

const style = {
  rectangle: {
    width: 20,
    height: 20,
    display: 'inline-block',
    cursor: 'pointer',
  },
  colorPickerArea: {
    position: 'absolute' as 'absolute',
    zIndex: '2',
  },
  colorPickerCover: {
    position: 'fixed' as 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
};

const ConfigDialog = ({
  open,
  config,
  graphData,
  nodeColor,
  setNodeColor,
  setShowDetailOnClick,
  setShowTitle,
  setShowExtendedRelation,
  setSearch,
  openAnimeDrawer,
  closeAnimeDrawer,
}: {
  open: boolean;
  config: ConfigState;
  graphData: GraphData;
  nodeColor: any;
  setNodeColor: (status: string, color: string) => void;
  setShowDetailOnClick: (v: boolean) => void;
  setShowTitle: (v: boolean) => void;
  setShowExtendedRelation: (v: boolean) => void;
  setSearch: (v: string) => void;
  openAnimeDrawer: (anime_id: number, force: boolean) => void;
  closeAnimeDrawer: () => void;
}) => {
  const [formState, setFormState] = React.useState({
    open: false,

    search: '',

    watchingNodeColor: nodeColor[UserAnimeStatus.watching],
    watchingNodeColorShow: false,
    completedNodeColor: nodeColor[UserAnimeStatus.completed],
    completedNodeColorShow: false,
    onHoldNodeColor: nodeColor[UserAnimeStatus.on_hold],
    onHoldNodeColorShow: false,
    droppedNodeColor: nodeColor[UserAnimeStatus.dropped],
    droppedNodeColorShow: false,
    plannedNodeColor: nodeColor[UserAnimeStatus.planned],
    plannedNodeColorShow: false,
    otherNodeColor: nodeColor[''],
    otherNodeColorShow: false,

    showDetails: config.showDetailOnClick,
    showTitle: config.showTitle,
    showExtendedRelation: config.showExtendedRelation,
  });

  const handleToggleOpenForm = () => {
    setFormState({ ...formState, open: !formState.open });
  };

  const showColor = (status: string, show: boolean) => {
    switch (status) {
      case UserAnimeStatus.watching:
        setFormState({ ...formState, watchingNodeColorShow: show });
        break;
      case UserAnimeStatus.completed:
        setFormState({ ...formState, completedNodeColorShow: show });
        break;
      case UserAnimeStatus.on_hold:
        setFormState({ ...formState, onHoldNodeColorShow: show });
        break;
      case UserAnimeStatus.dropped:
        setFormState({ ...formState, droppedNodeColorShow: show });
        break;
      case UserAnimeStatus.planned:
        setFormState({ ...formState, plannedNodeColorShow: show });
        break;
      case '':
        setFormState({ ...formState, otherNodeColorShow: show });
        break;
    }
  };

  const setColor = (status: string, color: string) => {
    switch (status) {
      case UserAnimeStatus.watching:
        setFormState({ ...formState, watchingNodeColor: color });
        break;
      case UserAnimeStatus.completed:
        setFormState({ ...formState, completedNodeColor: color });
        break;
      case UserAnimeStatus.on_hold:
        setFormState({ ...formState, onHoldNodeColor: color });
        break;
      case UserAnimeStatus.dropped:
        setFormState({ ...formState, droppedNodeColor: color });
        break;
      case UserAnimeStatus.planned:
        setFormState({ ...formState, plannedNodeColor: color });
        break;
      case '':
        setFormState({ ...formState, otherNodeColor: color });
        break;
      default:
        return;
    }
    setNodeColor(status, color);
  };

  const handleShowDetailCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, showDetails: e.target.checked });
    setShowDetailOnClick(e.target.checked);
  };

  const handleShowTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, showTitle: e.target.checked });
    setShowTitle(e.target.checked);
  };

  const handleShowExtendedRelation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, showExtendedRelation: e.target.checked });
    setShowExtendedRelation(e.target.checked);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, search: e.target.value });
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setFormState({ ...formState, search: '' });
    setSearch('');
  };

  const [dialogWidth, setDialogWidth] = React.useState(270);

  const [listDialogState, setListDialogState] = React.useState<ListDialogState>({
    open: false,
  });

  const handleOpenListDialog = () => {
    setListDialogState({ ...listDialogState, open: true });
    closeAnimeDrawer();
  };

  const handleCloseListDialog = () => {
    setListDialogState({ ...listDialogState, open: false });
  };

  const [statsDialogState, setStatsDialogState] = React.useState<StatsDialogState>({
    open: false,
  });

  const handleOpenStatsDialog = () => {
    setStatsDialogState({ ...statsDialogState, open: true });
    closeAnimeDrawer();
  };

  const handleCloseStatsDialog = () => {
    setStatsDialogState({ ...statsDialogState, open: false });
  };

  return (
    <>
      <Dialog
        open={open}
        PaperComponent={DraggablePaper}
        PaperProps={{ sx: { overflow: 'visible', width: dialogWidth, minWidth: 200 } }}
        hideBackdrop
        disableEnforceFocus
        sx={{
          top: 5,
          left: 5,
          [theme.breakpoints.down('md')]: {
            left: '50%',
            transform: 'translate(-50%, 0)',
          },
          height: 'fit-content',
          width: 'fit-content',
        }}
        TransitionComponent={GrowTransition}
        aria-labelledby="draggable-title"
      >
        <Resizable
          width={dialogWidth}
          height={200}
          onResize={(e: any, _) => {
            setDialogWidth(dialogWidth + e.movementX);
          }}
        >
          <>
            <DialogTitle id="draggable-title" style={{ cursor: 'move' }}>
              {`${config.username}'s Anime World `}
              <Tooltip placement="right" arrow title={`show ${formState.open ? 'less' : 'more'}`}>
                <IconButton onClick={handleToggleOpenForm} size="small">
                  {formState.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            </DialogTitle>
            <Collapse in={formState.open}>
              <DialogContent dividers>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      label="Anime Title"
                      placeholder="naruto"
                      size="small"
                      fullWidth
                      value={formState.search}
                      onChange={handleSearch}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {formState.search === '' ? (
                              <SearchIcon fontSize="small" />
                            ) : (
                              <IconButton size="small" onClick={clearSearch}>
                                <ClearIcon fontSize="small" />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    Status Colors
                  </Grid>
                  <Grid item xs={2}>
                    <Box
                      component="span"
                      onClick={() => showColor(UserAnimeStatus.watching, true)}
                      sx={{ ...style.rectangle, background: formState.watchingNodeColor }}
                    />
                    <ColorPicker
                      open={formState.watchingNodeColorShow}
                      color={formState.watchingNodeColor}
                      onClose={() => showColor(UserAnimeStatus.watching, false)}
                      onChange={(color: any) => setColor(UserAnimeStatus.watching, color.hex)}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    Watching
                  </Grid>

                  <Grid item xs={2}>
                    <Box
                      component="span"
                      onClick={() => showColor(UserAnimeStatus.completed, true)}
                      sx={{ ...style.rectangle, background: formState.completedNodeColor }}
                    />
                    <ColorPicker
                      open={formState.completedNodeColorShow}
                      color={formState.completedNodeColor}
                      onClose={() => showColor(UserAnimeStatus.completed, false)}
                      onChange={(color: any) => setColor(UserAnimeStatus.completed, color.hex)}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    Completed
                  </Grid>

                  <Grid item xs={2}>
                    <Box
                      component="span"
                      onClick={() => showColor(UserAnimeStatus.on_hold, true)}
                      sx={{ ...style.rectangle, background: formState.onHoldNodeColor }}
                    />
                    <ColorPicker
                      open={formState.onHoldNodeColorShow}
                      color={formState.onHoldNodeColor}
                      onClose={() => showColor(UserAnimeStatus.on_hold, false)}
                      onChange={(color: any) => setColor(UserAnimeStatus.on_hold, color.hex)}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    On Hold
                  </Grid>

                  <Grid item xs={2}>
                    <Box
                      component="span"
                      onClick={() => showColor(UserAnimeStatus.dropped, true)}
                      sx={{ ...style.rectangle, background: formState.droppedNodeColor }}
                    />
                    <ColorPicker
                      open={formState.droppedNodeColorShow}
                      color={formState.droppedNodeColor}
                      onClose={() => showColor(UserAnimeStatus.dropped, false)}
                      onChange={(color: any) => setColor(UserAnimeStatus.dropped, color.hex)}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    Dropped
                  </Grid>

                  <Grid item xs={2}>
                    <Box
                      component="span"
                      onClick={() => showColor(UserAnimeStatus.planned, true)}
                      sx={{ ...style.rectangle, background: formState.plannedNodeColor }}
                    />
                    <ColorPicker
                      open={formState.plannedNodeColorShow}
                      color={formState.plannedNodeColor}
                      onClose={() => showColor(UserAnimeStatus.planned, false)}
                      onChange={(color: any) => setColor(UserAnimeStatus.planned, color.hex)}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    Planned
                  </Grid>

                  <Grid item xs={2}>
                    <Box
                      component="span"
                      onClick={() => showColor('', true)}
                      sx={{ ...style.rectangle, background: formState.otherNodeColor }}
                    />
                    <ColorPicker
                      open={formState.otherNodeColorShow}
                      color={formState.otherNodeColor}
                      onClose={() => showColor('', false)}
                      onChange={(color: any) => setColor('', color.hex)}
                    />
                  </Grid>
                  <Grid item xs={10}>
                    Other
                  </Grid>
                  <Grid item xs={12}>
                    <Tooltip placement="right" arrow title="Show anime detail when a node is clicked">
                      <FormControlLabel
                        label="Show anime detail"
                        control={
                          <Checkbox
                            size="small"
                            defaultChecked={true}
                            value={formState.showDetails}
                            onChange={handleShowDetailCheckBox}
                          />
                        }
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      label="Always show anime title"
                      control={<Checkbox size="small" value={formState.showTitle} onChange={handleShowTitle} />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Tooltip placement="right" arrow title="Show all indirect anime relation when a node is hovered">
                      <FormControlLabel
                        label="Show extended relation"
                        control={
                          <Checkbox
                            size="small"
                            value={formState.showExtendedRelation}
                            onChange={handleShowExtendedRelation}
                          />
                        }
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Button fullWidth onClick={handleOpenListDialog}>
                      Show Anime List
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth onClick={handleOpenStatsDialog}>
                      Show Stats
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth onClick={() => window.location.reload()} color="error">
                      Change username
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </Collapse>
          </>
        </Resizable>
      </Dialog>

      <ListDialog
        open={listDialogState.open}
        onClose={handleCloseListDialog}
        username={config.username}
        nodes={graphData.nodes}
        nodeColor={nodeColor}
        showAnimeDrawer={openAnimeDrawer}
      />

      <StatsDialog
        open={statsDialogState.open}
        onClose={handleCloseStatsDialog}
        username={config.username}
        nodes={graphData.nodes}
        nodeColor={nodeColor}
      />
    </>
  );
};

export default ConfigDialog;

const DraggablePaper = (props: PaperProps) => {
  return (
    <Draggable handle="#draggable-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

const ColorPicker = ({
  open,
  color,
  onClose,
  onChange,
}: {
  open: boolean;
  color: string;
  onClose: any;
  onChange: any;
}) => {
  if (!open) return <></>;
  return (
    <div style={style.colorPickerArea}>
      <div style={style.colorPickerCover} onClick={onClose} />
      <SketchPicker color={color} onChange={onChange} />
    </div>
  );
};
