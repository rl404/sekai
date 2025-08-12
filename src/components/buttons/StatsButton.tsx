import Button from '@mui/material/Button';
import { memo, useState } from 'react';
import StatsDialog from '@/src/components/dialogs/StatsDialog';

const StatsButton = memo(function StatsButton() {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <Button fullWidth onClick={toggleOpen}>
        Show Stats
      </Button>
      <StatsDialog open={open} toggleOpen={toggleOpen} />
    </>
  );
});

export default StatsButton;
