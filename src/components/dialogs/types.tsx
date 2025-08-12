type align = 'left' | 'center' | 'right';

export type TableHeader = {
  key: string;
  label: string;
  align?: align;
};

export type Order = 'asc' | 'desc';
