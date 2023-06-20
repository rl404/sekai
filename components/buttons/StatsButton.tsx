import StatsDialog from "../dialogs/StatsDialog";
import { StatsDialogRefType } from "../dialogs/types";
import { Button } from "@mui/material";
import { memo, useRef } from "react";

const StatsButton = memo(() => {
  const ref = useRef<StatsDialogRefType>();

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
