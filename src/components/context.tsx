import { createContext, useContext } from 'react';
import { Graph } from '@/src/components/graphs/types';
import { UserAnimeStatus } from '@/src/libs/constant';

type ContextType = {
  username: string;
  dialogConfigOpen: boolean;
  graphData: Graph;
  graphFocusTrigger: number;
  nodeSearch: string;
  showNodeTitle: boolean;
  showNodeDetail: boolean;
  showLinkExtended: boolean;
  nodeColor: { [status in UserAnimeStatus]: string };
  drawerAnimeID: number;
  drawerOpen: boolean;
  onOpenDrawer: (animeID: number) => void;
  onCloseDrawer: () => void;
};

export const defaultCtx: ContextType = {
  username: '',
  dialogConfigOpen: false,
  graphData: { nodes: [], links: [] },
  graphFocusTrigger: 0,
  nodeSearch: '',
  showNodeTitle: false,
  showNodeDetail: true,
  showLinkExtended: false,
  nodeColor: {
    '': '#000',
    [UserAnimeStatus.watching]: '#4caf50',
    [UserAnimeStatus.completed]: '#2196f3',
    [UserAnimeStatus.onHold]: '#ffc107',
    [UserAnimeStatus.dropped]: '#e91e63',
    [UserAnimeStatus.planned]: '#fff',
  },
  drawerAnimeID: 0,
  drawerOpen: false,
  onOpenDrawer: () => {},
  onCloseDrawer: () => {},
};

type DispatchContextAction = {
  type: keyof typeof defaultCtx;
  value: any;
};

type DispatchContextType = (action: DispatchContextAction) => void;

export const Context = createContext<ContextType>(defaultCtx);
export const DispatchContex = createContext<DispatchContextType>(() => {});

export const useCtx = () => useContext(Context);
export const useDispatchCtx = () => useContext(DispatchContex);

export const reducer = (state: ContextType, action: DispatchContextAction): ContextType => {
  return { ...state, [action.type]: action.value };
};
