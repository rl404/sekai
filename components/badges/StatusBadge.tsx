import { AnimeStatus, AnimeStatusToStr } from "@/libs/constant";
import Chip from "@mui/material/Chip";
import { memo } from "react";

const statusColor: {
  [x: string]: "default" | "primary" | "success";
} = {
  [AnimeStatus.finished]: "primary",
  [AnimeStatus.releasing]: "success",
  [AnimeStatus.notYet]: "default",
};

const StatusBadge = memo(({ status }: { status: string }) => {
  if (status === "") return;
  return <Chip size="small" label={AnimeStatusToStr(status)} color={statusColor[status]} />;
});

export default StatusBadge;
