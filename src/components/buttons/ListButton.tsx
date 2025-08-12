import Button from '@mui/material/Button';
import { memo, useState } from 'react';
import ListDialog from '@/src/components/dialogs/ListDialog';

const ListButton = memo(function ListButton() {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <Button fullWidth onClick={toggleOpen}>
        Show Anime List
      </Button>
      <ListDialog open={open} toggleOpen={toggleOpen} />
    </>
  );
});

export default ListButton;
