import Chip from '@mui/material/Chip';
import { memo } from 'react';
import { AnimeStatus, AnimeStatusToStr } from '@/src/libs/constant';

const statusColor: {
  [x in AnimeStatus]: 'default' | 'primary' | 'success';
} = {
  '': 'default',
  [AnimeStatus.finished]: 'primary',
  [AnimeStatus.releasing]: 'success',
  [AnimeStatus.notYet]: 'default',
};

const StatusBadge = memo(function StatusBadge({ status }: { status: AnimeStatus }) {
  if (status === AnimeStatus['']) return;
  return <Chip size="small" label={AnimeStatusToStr(status)} color={statusColor[status]} />;
});

export default StatusBadge;
