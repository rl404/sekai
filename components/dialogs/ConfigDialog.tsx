import ListButton from "../buttons/ListButton";
import RecommendationButton from "../buttons/RecommendationButton";
import StatsButton from "../buttons/StatsButton";
import { useCtx, useDispatchCtx } from "../context";
import { theme } from "../theme";
import { UserAnimeStatus } from "@/libs/constant";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
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
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { ChangeEvent, KeyboardEvent, memo, useState } from "react";
import { Color, ColorResult, SketchPicker } from "react-color";
import Draggable from "react-draggable";

const ConfigDialog = memo(() => {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();
  const open = ctx.dialogConfigOpen;

  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");

  const toggleShow = () => {
    setShow(!show);
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    dispatch({ type: "nodeSearch", value: e.target.value });
  };

  const onSearchFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;
    dispatch({ type: "graphFocusTrigger", value: ctx.graphFocusTrigger + 1 });
  };

  const onSearchClear = () => {
    setSearch("");
    dispatch({ type: "nodeSearch", value: "" });
  };

  return (
    <Dialog
      open={open}
      PaperComponent={DraggablePaper}
      PaperProps={{ sx: { overflow: "visible", width: 300, minWidth: 200 } }}
      hideBackdrop
      disableEnforceFocus
      sx={{
        top: 5,
        left: 5,
        [theme.breakpoints.down("md")]: {
          left: "50%",
          transform: "translate(-50%, 0)",
        },
        height: "fit-content",
        width: "fit-content",
      }}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-title">
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <div>{`${ctx.username}'s Anime World `}</div>
          <div>
            <Tooltip placement="right" arrow title={`show ${show ? "less" : "more"}`}>
              <IconButton onClick={toggleShow} size="small">
                {show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </Stack>
      </DialogTitle>

      <Collapse in={show}>
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                label="Anime Title"
                placeholder="naruto"
                size="small"
                fullWidth
                value={search}
                onChange={onSearch}
                onKeyDown={onSearchFocus}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {search === "" ? (
                        <SearchIcon fontSize="small" />
                      ) : (
                        <IconButton size="small" onClick={onSearchClear}>
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
              <ColorPicker status={UserAnimeStatus.watching} />
            </Grid>
            <Grid item xs={10}>
              Watching
            </Grid>
            <Grid item xs={2}>
              <ColorPicker status={UserAnimeStatus.completed} />
            </Grid>
            <Grid item xs={10}>
              Completed
            </Grid>
            <Grid item xs={2}>
              <ColorPicker status={UserAnimeStatus.onHold} />
            </Grid>
            <Grid item xs={10}>
              On-Hold
            </Grid>
            <Grid item xs={2}>
              <ColorPicker status={UserAnimeStatus.dropped} />
            </Grid>
            <Grid item xs={10}>
              Dropped
            </Grid>
            <Grid item xs={2}>
              <ColorPicker status={UserAnimeStatus.planned} />
            </Grid>
            <Grid item xs={10}>
              Planned
            </Grid>
            <Grid item xs={2}>
              <ColorPicker status="" />
            </Grid>
            <Grid item xs={10}>
              Other
            </Grid>

            <Grid item xs={12}>
              <DetailCheckbox />
            </Grid>

            <Grid item xs={12}>
              <TitleCheckbox />
            </Grid>

            <Grid item xs={12}>
              <ExtendedCheckbox />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <ListButton />
            </Grid>
            <Grid item xs={12}>
              <StatsButton />
            </Grid>
            <Grid item xs={12}>
              <RecommendationButton />
            </Grid>
            <Grid item xs={12}>
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

const DraggablePaper = (props: PaperProps) => {
  return (
    <Draggable handle="#draggable-title">
      <Paper {...props} />
    </Draggable>
  );
};

const style = {
  rectangle: {
    width: 20,
    height: 20,
    display: "inline-block",
    cursor: "pointer",
  },
  colorPickerArea: {
    position: "absolute" as "absolute",
    zIndex: "2",
  },
  colorPickerCover: {
    position: "fixed" as "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  },
};

const ColorPicker = ({ status }: { status: string }) => {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<Color>(ctx.nodeColor[status]);

  const onClick = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onChange = (c: ColorResult) => {
    setColor(c.hex);
    dispatch({ type: "nodeColor", value: { ...ctx.nodeColor, [status]: c.hex } });
  };

  return (
    <>
      <Box component="span" onClick={onClick} sx={{ ...style.rectangle, background: ctx.nodeColor[status] }} />
      {open && (
        <div style={style.colorPickerArea}>
          <div style={style.colorPickerCover} onClick={onClose} />
          <SketchPicker color={color} onChange={onChange} />
        </div>
      )}
    </>
  );
};

const DetailCheckbox = () => {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const [checked, setChecked] = useState(ctx.nodeDetail);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    dispatch({ type: "nodeDetail", value: e.target.checked });
  };

  return (
    <Tooltip placement="right" arrow title="Show anime detail when a node is clicked">
      <FormControlLabel
        label="Show anime detail"
        control={<Checkbox size="small" defaultChecked={true} value={checked} onChange={onChange} />}
      />
    </Tooltip>
  );
};

const TitleCheckbox = () => {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const [checked, setChecked] = useState(ctx.nodeTitle);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    dispatch({ type: "nodeTitle", value: e.target.checked });
  };

  return (
    <FormControlLabel
      label="Always show anime title"
      control={<Checkbox size="small" value={checked} onChange={onChange} />}
    />
  );
};

const ExtendedCheckbox = () => {
  const ctx = useCtx();
  const dispatch = useDispatchCtx();

  const [checked, setChecked] = useState(ctx.linkExtended);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    dispatch({ type: "linkExtended", value: e.target.checked });
  };

  return (
    <Tooltip placement="right" arrow title="Show all indirect anime relation when a node is hovered">
      <FormControlLabel
        label="Show extended relation"
        control={<Checkbox size="small" value={checked} onChange={onChange} />}
      />
    </Tooltip>
  );
};
