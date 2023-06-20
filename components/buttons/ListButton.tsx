import ListDialog from "../dialogs/ListDialog";
import { ListDialogRefType } from "../dialogs/types";
import { Button } from "@mui/material";
import { memo, useRef } from "react";

const ListButton = memo(() => {
  const ref = useRef<ListDialogRefType>();

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
