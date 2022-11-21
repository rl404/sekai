import * as React from 'react';
import { Chip } from '@mui/material';
import { AnimeStatus, AnimeStatusToStr } from '../../utils/constant';

const statusColor: {
  [x: string]: 'default' | 'primary' | 'success';
} = {
  [AnimeStatus.finished]: 'primary',
  [AnimeStatus.releasing]: 'success',
  [AnimeStatus.not_yet]: 'default',
};

const StatusBadge = React.memo(({ status }: { status: string }) => {
  if (status === '') return <></>;
  return <Chip size="small" label={AnimeStatusToStr(status)} color={statusColor[status]} />;
});

export default StatusBadge;
