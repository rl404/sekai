import StatsDialog from '@/components/dialogs/StatsDialog';
import { StatsDialogRefType } from '@/components/dialogs/types';
import Button from '@mui/material/Button';
import { memo, useRef } from 'react';

const StatsButton = memo(() => {
  const ref = useRef<StatsDialogRefType>(null);

  const onClick = () => {
    ref.current?.setOpen(true);
  };

  return (
    <>
      <Button fullWidth onClick={onClick}>
        Show Stats
      </Button>
      <StatsDialog ref={ref} />
    </>
  );
});

export default StatsButton;
