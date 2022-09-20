import { Dialog, DialogContent, DialogTitle, Grid, Link } from '@mui/material';
import * as React from 'react';
import { GraphNode } from '../../types/Types';
import StatusCircle from '../circle/StatusCircle';

const ChartNodeDialog = ({
  open,
  onClose,
  title,
  nodes = [],
  nodeColor,
  showAnimeDrawer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  nodes: Array<GraphNode>;
  nodeColor: any;
  showAnimeDrawer: (anime_id: number) => void;
}) => {
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
                    onClick={() => showAnimeDrawer(n.id)}
                  >
                    {n.title}
                  </Link>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ChartNodeDialog;
