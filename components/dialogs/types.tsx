export type ListDialogRefType = {
  setOpen: (open: boolean) => void;
};

export type StatsDialogRefType = {
  setOpen: (open: boolean) => void;
};

export type RecommendationDialogRefType = {
  setOpen: (open: boolean) => void;
};

export type ChartNodeDialogRefType = {
  setOpen: (open: boolean) => void;
};

type align = "left" | "center" | "right";

export type TableHeader = {
  key: string;
  label: string;
  align?: align;
};

export type Order = "asc" | "desc";
