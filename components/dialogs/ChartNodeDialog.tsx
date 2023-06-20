import StatusCircle from "../circles/StatusCircle";
import AnimeDrawer from "../drawers/AnimeDrawer";
import { AnimeDrawerRefType } from "../drawers/types";
import { Node } from "../graphs/types";
import { Dialog, DialogContent, DialogTitle, Grid, Link } from "@mui/material";
import { Fragment, forwardRef, memo, useImperativeHandle, useRef, useState } from "react";

const ChartNodeDialog = memo(
  forwardRef(({ title, data }: { title: string; data: Node[] }, ref) => {
    const drawerRef = useRef<AnimeDrawerRefType>();

    const [open, setOpen] = useState(false);
    const [drawerAnimeID, setDrawerAnimeID] = useState(0);

    const onClose = () => {
      setOpen(false);
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
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {data.map((n) => {
              return (
                <Fragment key={n.id}>
                  <Grid item xs={1}>
                    <StatusCircle status={n.userAnimeStatus} />
                  </Grid>
                  <Grid item xs={11}>
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
              );
            })}
          </Grid>
        </DialogContent>
        <AnimeDrawer ref={drawerRef} animeID={drawerAnimeID} />
      </Dialog>
    );
  })
);

export default ChartNodeDialog;
