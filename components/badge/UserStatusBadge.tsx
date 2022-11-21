import * as React from 'react';
import { Chip } from '@mui/material';
import { UserAnimeStatus, UserAnimeStatusStr } from '../../utils/constant';

const statusColor: {
  [x: string]: 'default' | 'primary' | 'success' | 'warning' | 'error';
} = {
  [UserAnimeStatus.watching]: 'success',
  [UserAnimeStatus.completed]: 'primary',
  [UserAnimeStatus.on_hold]: 'warning',
  [UserAnimeStatus.dropped]: 'error',
  [UserAnimeStatus.planned]: 'default',
};

const UserStatusBadge = React.memo(({ status }: { status: string }) => {
  if (status === '') return <></>;
  return <Chip size="small" label={UserAnimeStatusStr(status)} color={statusColor[status]} />;
});

export default UserStatusBadge;
