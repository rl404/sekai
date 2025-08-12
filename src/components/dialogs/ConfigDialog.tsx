import ClearIcon from '@mui/icons-material/Clear';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { ChangeEvent, KeyboardEvent, memo, useRef, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';
import Draggable from 'react-draggable';
import ListButton from '@/src/components/buttons/ListButton';
import RecommendationButton from '@/src/components/buttons/RecommendationButton';
import StatsButton from '@/src/components/buttons/StatsButton';
import { useCtx, useDispatchCtx } from '@/src/components/context';
import theme from '@/src/components/theme';
import { UserAnimeStatus } from '@/src/libs/constant';

const styles = {
  dialog: {
    top: 5,
    left: 5,
    [theme.breakpoints.down('md')]: {
      left: '50%',
      transform: 'translate(-50%, 0)',
    },
    height: 'fit-content',
    width: 'fit-content',
  },
  dialogPaper: {
    overflow: 'visible',
    width: 300,
    minWidth: 200,
  },
  rectangle: {
    width: 20,
    height: 20,
    display: 'inline-block',
    cursor: 'pointer',
  },
  colorPickerArea: {
    position: 'absolute',
    zIndex: '2',
  },
  colorPickerCover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
};

const ConfigDialog = memo(function ConfigDialog() {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const [expand, setExpand] = useState(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'nodeSearch', value: e.target.value });
  };

  const onSearchFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return;
    dispatch({ type: 'graphFocusTrigger', value: ctx.graphFocusTrigger + 1 });
  };

  const onSearchClear = () => {
    dispatch({ type: 'nodeSearch', value: '' });
  };

  return (
    <Dialog
      open={ctx.dialogConfigOpen}
      hideBackdrop
      disableEnforceFocus
      PaperComponent={DraggablePaper}
      slotProps={{ paper: { sx: styles.dialogPaper } }}
      sx={styles.dialog}
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>{`${ctx.username}'s Anime World `}</Box>
          <Box>
            <Tooltip placement="right" arrow title={`show ${expand ? 'less' : 'more'}`}>
              <IconButton onClick={toggleExpand} size="small">
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </DialogTitle>

      <Collapse in={expand}>
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid size={12}>
              <TextField
                label="Anime Title"
                placeholder="naruto"
                size="small"
                fullWidth
                value={ctx.nodeSearch}
                onChange={onSearch}
                onKeyDown={onSearchFocus}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {ctx.nodeSearch === '' ? (
                          <SearchIcon fontSize="small" />
                        ) : (
                          <IconButton size="small" onClick={onSearchClear}>
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={12}>Status Colors</Grid>
            <Grid size={2}>
              <ColorPicker status={UserAnimeStatus.watching} />
            </Grid>
            <Grid size={10}>Watching</Grid>
            <Grid size={2}>
              <ColorPicker status={UserAnimeStatus.completed} />
            </Grid>
            <Grid size={10}>Completed</Grid>
            <Grid size={2}>
              <ColorPicker status={UserAnimeStatus.onHold} />
            </Grid>
            <Grid size={10}>On-Hold</Grid>
            <Grid size={2}>
              <ColorPicker status={UserAnimeStatus.dropped} />
            </Grid>
            <Grid size={10}>Dropped</Grid>
            <Grid size={2}>
              <ColorPicker status={UserAnimeStatus.planned} />
            </Grid>
            <Grid size={10}>Planned</Grid>
            <Grid size={2}>
              <ColorPicker status={UserAnimeStatus['']} />
            </Grid>
            <Grid size={10}>Other</Grid>

            <Grid size={12}>
              <DetailCheckbox />
            </Grid>

            <Grid size={12}>
              <TitleCheckbox />
            </Grid>

            <Grid size={12}>
              <ExtendedCheckbox />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogContent>
          <Grid container spacing={1}>
            <Grid size={12}>
              <ListButton />
            </Grid>
            <Grid size={12}>
              <StatsButton />
            </Grid>
            <Grid size={12}>
              <RecommendationButton />
            </Grid>
            <Grid size={12}>
              <Button fullWidth onClick={() => window.location.reload()} color="error">
                Change username
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Collapse>
    </Dialog>
  );
});

export default ConfigDialog;

const DraggablePaper = memo(function DraggablePaper(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable nodeRef={nodeRef} handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
});

const ColorPicker = memo(function ColorPicker({ status }: { status: UserAnimeStatus }) {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onChange = (c: ColorResult) => {
    dispatch({ type: 'nodeColor', value: { ...ctx.nodeColor, [status]: c.hex } });
  };

  return (
    <>
      <Box component="span" onClick={onOpen} sx={{ ...styles.rectangle, background: ctx.nodeColor[status] }} />
      {open && (
        <Box sx={styles.colorPickerArea}>
          <Box sx={styles.colorPickerCover} onClick={onClose} />
          <SketchPicker color={ctx.nodeColor[status]} onChange={onChange} />
        </Box>
      )}
    </>
  );
});

const DetailCheckbox = memo(function DetailCheckbox() {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'showNodeDetail', value: e.target.checked });
  };

  return (
    <Tooltip placement="right" arrow title="Show anime detail when a node is clicked">
      <FormControlLabel
        label="Show anime detail"
        control={<Checkbox size="small" defaultChecked={true} value={ctx.showNodeDetail} onChange={onChange} />}
      />
    </Tooltip>
  );
});

const TitleCheckbox = memo(function TitleCheckbox() {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'showNodeTitle', value: e.target.checked });
  };

  return (
    <FormControlLabel
      label="Always show anime title"
      control={<Checkbox size="small" value={ctx.showNodeTitle} onChange={onChange} />}
    />
  );
});

const ExtendedCheckbox = memo(function ExtendedCheckbox() {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'showLinkExtended', value: e.target.checked });
  };

  return (
    <Tooltip placement="right" arrow title="Show all indirect anime relation when a node is hovered">
      <FormControlLabel
        label="Show extended relation"
        control={<Checkbox size="small" value={ctx.showLinkExtended} onChange={onChange} />}
      />
    </Tooltip>
  );
});
