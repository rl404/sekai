import ListDialog from '@/components/dialogs/ListDialog';
import { ListDialogRefType } from '@/components/dialogs/types';
import Button from '@mui/material/Button';
import { memo, useRef } from 'react';

const ListButton = memo(() => {
  const ref = useRef<ListDialogRefType>(null);

  const onClick = () => {
    ref.current?.setOpen(true);
  };

  return (
    <>
      <Button fullWidth onClick={onClick}>
        Show Anime List
      </Button>
      <ListDialog ref={ref} />
    </>
  );
});

export default ListButton;
