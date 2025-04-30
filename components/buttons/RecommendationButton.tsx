import RecommendationDialog from '@/components/dialogs/RecommendationDialog';
import { RecommendationDialogRefType } from '@/components/dialogs/types';
import Button from '@mui/material/Button';
import { memo, useRef } from 'react';

const RecommendationButton = memo(() => {
  const ref = useRef<RecommendationDialogRefType>(null);

  const onClick = () => {
    ref.current?.setOpen(true);
  };

  return (
    <>
      <Button fullWidth onClick={onClick}>
        Show Recommendations
      </Button>
      <RecommendationDialog ref={ref} />
    </>
  );
});

export default RecommendationButton;
