import { useCtx } from '@/components/context';
import { UserAnimeStatus } from '@/libs/constant';
import Tooltip from '@mui/material/Tooltip';
import { CSSProperties, memo } from 'react';

const style = {
  width: 20,
  height: 20,
  borderRadius: '50%',
  border: '1px solid white',
  margin: 'auto',
};

const StatusCircle = memo(({ status, sx }: { status: string; sx?: CSSProperties }) => {
  const ctx = useCtx();

  switch (status) {
    case UserAnimeStatus.watching:
      return (
        <Tooltip placement="left" arrow title="You are watching this">
          <div style={{ ...style, ...sx, background: ctx.nodeColor[status] }} />
        </Tooltip>
      );
    case UserAnimeStatus.completed:
      return (
        <Tooltip placement="left" arrow title="You have completed this">
          <div style={{ ...style, ...sx, background: ctx.nodeColor[status] }} />
        </Tooltip>
      );
    case UserAnimeStatus.onHold:
      return (
        <Tooltip placement="left" arrow title="You put this on hold">
          <div style={{ ...style, ...sx, background: ctx.nodeColor[status] }} />
        </Tooltip>
      );
    case UserAnimeStatus.dropped:
      return (
        <Tooltip placement="left" arrow title="You have dropped this">
          <div style={{ ...style, ...sx, background: ctx.nodeColor[status] }} />
        </Tooltip>
      );
    case UserAnimeStatus.planned:
      return (
        <Tooltip placement="left" arrow title="You are planning to watch this">
          <div style={{ ...style, ...sx, background: ctx.nodeColor[status] }} />
        </Tooltip>
      );
    default:
      return (
        <Tooltip placement="left" arrow title="Not in your list">
          <div style={{ ...style, ...sx, background: ctx.nodeColor[status] }} />
        </Tooltip>
      );
  }
});

export default StatusCircle;
