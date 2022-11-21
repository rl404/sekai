import * as React from 'react';
import { Tooltip } from '@mui/material';
import { UserAnimeStatus } from '../../utils/constant';

const style = {
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '1px solid white',
    margin: 'auto',
  },
};

const StatusCircle = React.memo(
  ({ status, color, sx }: { status: string; color: string; sx?: React.CSSProperties | undefined }) => {
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
  },
);

export default StatusCircle;
