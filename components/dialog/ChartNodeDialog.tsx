import { Dialog, DialogContent, DialogTitle, Grid, Link } from '@mui/material';
import * as React from 'react';
import { AnimeDrawerState, GraphNode } from '../../types/Types';
import StatusCircle from '../circle/StatusCircle';
import AnimeDrawer from '../drawer/AnimeDrawer';

const ChartNodeDialog = ({
  open,
  onClose,
  title,
  nodes = [],
  nodeColor,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  nodes: Array<GraphNode>;
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {nodes.map((n) => {
            return (
              <React.Fragment key={n.id}>
                <Grid item xs={1}>
                  <StatusCircle status={n.user_anime_status} color={nodeColor[n.user_anime_status] || 'black'} />
                </Grid>
                <Grid item xs={11}>
                  <Link
                    color="inherit"
                    underline="hover"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleOpenAnimeDrawer(n.id)}
                  >
                    {n.title}
                  </Link>
                </Grid>
              </React.Fragment>
            );
          })}
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
  );
};

export default ChartNodeDialog;
