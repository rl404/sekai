import { Dialog, DialogContent, DialogTitle, Grid, Link, Tooltip } from '@mui/material';
import * as React from 'react';
import { GraphNode } from '../../types/Types';
import { UserAnimeStatus } from '../../utils/constant';

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
  showAnimeDrawer: (anime_id: number, force: boolean) => void;
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
                  <StatusColor status={n.user_anime_status} color={nodeColor[n.user_anime_status] || 'black'} />
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
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ChartNodeDialog;

const style = {
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '1px solid white',
    margin: 'auto',
  },
};

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
