import type { NextPage } from 'next';
import * as React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import InitDialog from '../components/dialog/InitDialog';
import { AnimeRelation, UserAnimeStatus } from '../utils/constant';
import {
  AnimeDrawerState,
  ConfigDialogState,
  ConfigState,
  GraphData,
  InitDialogState,
} from '../types/Types';
import AnimeDrawer from '../components/drawer/AnimeDrawer';
import ConfigDialog from '../components/dialog/ConfigDialog';

const NoSSRForceGraph = dynamic(() => import('../components/graph/ForceGraph'), {
  ssr: false,
});

const Home: NextPage = () => {
  const [initDialogState, setInitDialogState] = React.useState<InitDialogState>({
    open: true,
  });

  const handleOpenInitDialog = () => {
    setInitDialogState({ ...initDialogState, open: true });
  };

  const handleCloseInitDialog = () => {
    setInitDialogState({ ...initDialogState, open: false });
  };

  const [graphDataState, setGraphDataState] = React.useState<GraphData>({
    nodes: [],
    links: [],
  });

  const setGraphData = (data: GraphData) => {
    setGraphDataState(data);
  };

  const [graphNodeColorState, setGraphNodeColorState] = React.useState({
    '': '#000',
    [UserAnimeStatus.watching]: '#4caf50',
    [UserAnimeStatus.completed]: '#2196f3',
    [UserAnimeStatus.on_hold]: '#ffc107',
    [UserAnimeStatus.dropped]: '#e91e63',
    [UserAnimeStatus.planned]: '#fff',
  });

  const [graphLinkColorState, setGraphLinkColorState] = React.useState({
    '': 'rgba(255,255,255,0.1)',
    [AnimeRelation.sequel]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.prequel]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.alternative_setting]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.alternative_version]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.side_story]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.parent_story]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.summary]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.full_story]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.spin_off]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.adaptation]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.character]: 'rgba(255,255,255,0.1)',
    [AnimeRelation.other]: 'rgba(255,255,255,0.1)',
  });

  const [animeDrawerState, setAnimeDrawerState] = React.useState<AnimeDrawerState>({
    open: false,
    anime_id: 0,
  });

  const handleOpenAnimeDrawer = (anime_id: number) => {
    if (!configState.showDetailOnClick) return;
    setAnimeDrawerState({ ...animeDrawerState, open: true, anime_id: anime_id });
  };

  const handleCloseAnimeDrawer = () => {
    setAnimeDrawerState({ ...animeDrawerState, open: false, anime_id: 0 });
  };

  const [configDialogState, setConfigDialogState] = React.useState<ConfigDialogState>({
    open: false,
  });

  const handleOpenConfigDialog = () => {
    setConfigDialogState({ ...configDialogState, open: true });
  };

  const handleCloseConfigDialog = () => {
    setConfigDialogState({ ...configDialogState, open: false });
  };

  const [configState, setConfigState] = React.useState<ConfigState>({
    username: '',
    showDetailOnClick: true,
    showTitle: false,
    showRelation: false,
  });

  const setConfigUsername = (username: string) => {
    setConfigState({ ...configState, username: username });
  };

  const setShowDetailOnClick = (v: boolean) => {
    setConfigState({ ...configState, showDetailOnClick: v });
    !v && handleCloseAnimeDrawer();
  };

  const setShowTitle = (v: boolean) => {
    setConfigState({ ...configState, showTitle: v });
  };

  const setShowRelation = (v: boolean) => {
    setConfigState({ ...configState, showRelation: v });
  };

  return (
    <>
      <Head>
        <title>Project Sekai</title>
        <meta name="description" content="Your anime world." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NoSSRForceGraph
        graphData={graphDataState}
        nodeColor={graphNodeColorState}
        linkColor={graphLinkColorState}
        showTitle={configState.showTitle}
        showRelation={configState.showRelation}
        onNodeClick={handleOpenAnimeDrawer}
      />

      <InitDialog
        open={initDialogState.open}
        onClose={handleCloseInitDialog}
        setGraphData={setGraphData}
        openConfigDialog={handleOpenConfigDialog}
        setConfigUsername={setConfigUsername}
      />

      <ConfigDialog
        open={configDialogState.open}
        onClose={handleCloseConfigDialog}
        config={configState}
        nodeColor={graphNodeColorState}
        setNodeColor={(status, color) => {
          setGraphNodeColorState({ ...graphNodeColorState, [status]: color });
        }}
        setShowDetailOnClick={setShowDetailOnClick}
        setShowTitle={setShowTitle}
        setShowRelation={setShowRelation}
      />

      <AnimeDrawer
        open={animeDrawerState.open}
        anime_id={animeDrawerState.anime_id}
        onClose={handleCloseAnimeDrawer}
      />
    </>
  );
};

export default Home;
