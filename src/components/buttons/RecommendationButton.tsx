import Button from '@mui/material/Button';
import { memo, useState } from 'react';
import RecommendationDialog from '@/src/components/dialogs/RecommendationDialog';

const RecommendationButton = memo(function RecommendationButton() {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <Button fullWidth onClick={toggleOpen}>
        Show Recommendations
      </Button>
      <RecommendationDialog open={open} toggleOpen={toggleOpen} />
    </>
  );
});

export default RecommendationButton;
