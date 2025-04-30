import { AnimeRelation, UserAnimeStatus } from '@/libs/constant';
import { createContext, useContext } from 'react';
import { Graph } from './graphs/types';

type ContextType = {
  username: string;
  dialogConfigOpen: boolean;
  graph: Graph;
  graphFocusTrigger: number;
  nodeColor: { [status: string]: string };
  linkColor: { [relation: string]: string };
  nodeSearch: '';
  nodeTitle: boolean;
  nodeDetail: boolean;
  linkExtended: boolean;
};

export const defaultCtx: ContextType = {
  username: '',
  dialogConfigOpen: false,
  graph: { nodes: [], links: [] },
  graphFocusTrigger: 0,
  nodeColor: {
    '': '#000',
    inactive: 'rgba(255,255,255,0.1)',
    [UserAnimeStatus.watching]: '#4caf50',
    [UserAnimeStatus.completed]: '#2196f3',
    [UserAnimeStatus.onHold]: '#ffc107',
    [UserAnimeStatus.dropped]: '#e91e63',
    [UserAnimeStatus.planned]: '#fff',
  },
  linkColor: {
    '': 'rgba(255,255,255,0.1)',
    inactive: 'rgba(255,255,255,0.1)',
    [AnimeRelation.sequel]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.prequel]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.alternativeSetting]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.alternativeVersion]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.sideStory]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.parentStory]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.summary]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.fullStory]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.spinOff]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.adaptation]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.character]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.other]: 'rgba(255,255,255,0.1)',
  },
  nodeSearch: '',
  nodeTitle: false,
  nodeDetail: true,
  linkExtended: false,
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
