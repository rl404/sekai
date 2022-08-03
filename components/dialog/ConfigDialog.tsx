import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  PaperProps,
  Tooltip,
} from '@mui/material';
import * as React from 'react';
import Draggable from 'react-draggable';
import { ConfigState } from '../../types/Types';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UserAnimeStatus } from '../../utils/constant';
import { SketchPicker } from 'react-color';

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
  onClose,
  config,
  nodeColor,
  setNodeColor,
  setShowDetailOnClick,
  setShowTitle,
  setShowRelation,
  openListDialog,
}: {
  open: boolean;
  onClose: any;
  config: ConfigState;
  nodeColor: any;
  setNodeColor: (status: string, color: string) => void;
  setShowDetailOnClick: (v: boolean) => void;
  setShowTitle: (v: boolean) => void;
  setShowRelation: (v: boolean) => void;
  openListDialog: () => void;
}) => {
  const [formState, setFormState] = React.useState({
    open: false,

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
    showRelation: config.showRelation,
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

  const handleShowRelation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, showRelation: e.target.checked });
    setShowRelation(e.target.checked);
  };

  return (
    <Dialog
      open={open}
      PaperComponent={DraggablePaper}
      PaperProps={{ sx: { overflow: 'visible', width: 270 } }}
      hideBackdrop
      disableEnforceFocus
      style={{
        top: 5,
        left: 5,
        height: 'fit-content',
        width: 'fit-content',
      }}
    >
      <DialogTitle>
        <Grid container>
          <Grid item>{config.username}'s Anime World </Grid>
          <Grid item xs />
          <Grid item>
            <Tooltip placement="right" arrow title={`show ${formState.open ? 'less' : 'more'}`}>
              <IconButton onClick={handleToggleOpenForm} size="small">
                {formState.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </DialogTitle>
      {formState.open && (
        <>
          <DialogContent dividers>
            <Grid container spacing={1}>
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
                        defaultChecked={formState.showDetails}
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
                  control={
                    <Checkbox
                      size="small"
                      defaultChecked={formState.showTitle}
                      value={formState.showTitle}
                      onChange={handleShowTitle}
                    />
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                <Button fullWidth onClick={openListDialog}>
                  Show Anime List
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default ConfigDialog;

const DraggablePaper = (props: PaperProps) => {
  return (
    <Draggable>
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
