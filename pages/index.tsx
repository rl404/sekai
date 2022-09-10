import type { NextPage } from 'next';
import * as React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import InitDialog from '../components/dialog/InitDialog';
import { AnimeRelation, UserAnimeStatus } from '../utils/constant';
import { AnimeDrawerState, ConfigDialogState, ConfigState, GraphData, InitDialogState } from '../types/Types';
import AnimeDrawer from '../components/drawer/AnimeDrawer';
import ConfigDialog from '../components/dialog/ConfigDialog';
import { IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const style = {
  githubIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
};

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
    showExtendedRelation: false,
  });

  const handleOpenAnimeDrawer = (anime_id: number, force: boolean = false) => {
    if (!configState.showDetailOnClick && !force) return;
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

  const [configState, setConfigState] = React.useState<ConfigState>({
    username: '',
    showDetailOnClick: true,
    showTitle: false,
    showExtendedRelation: false,
    search: '',
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

  const setShowExtendedRelation = (v: boolean) => {
    setConfigState({ ...configState, showExtendedRelation: v });
  };

  const setSearch = (v: string) => {
    setConfigState({ ...configState, search: v });
  };

  const title = 'Project Sekai';
  const desc = 'Convert your MyAnimeList anime list to force-directed graph and see your anime world.';
  const image = '/images/main.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NoSSRForceGraph
        search={configState.search}
        graphData={graphDataState}
        nodeColor={graphNodeColorState}
        linkColor={graphLinkColorState}
        showTitle={configState.showTitle}
        showExtendedRelation={configState.showExtendedRelation}
        showAnimeDrawer={handleOpenAnimeDrawer}
      />

      <IconButton href="https://github.com/rl404/sekai" target={'_blank'} sx={style.githubIcon}>
        <GitHubIcon />
      </IconButton>

      <InitDialog
        open={initDialogState.open}
        onClose={handleCloseInitDialog}
        setGraphData={setGraphData}
        openConfigDialog={handleOpenConfigDialog}
        setConfigUsername={setConfigUsername}
      />

      <ConfigDialog
        open={configDialogState.open}
        config={configState}
        graphData={graphDataState}
        nodeColor={graphNodeColorState}
        setNodeColor={(status, color) => {
          setGraphNodeColorState({ ...graphNodeColorState, [status]: color });
        }}
        setShowDetailOnClick={setShowDetailOnClick}
        setShowTitle={setShowTitle}
        setShowExtendedRelation={setShowExtendedRelation}
        openAnimeDrawer={handleOpenAnimeDrawer}
        closeAnimeDrawer={handleCloseAnimeDrawer}
        setSearch={setSearch}
      />

      <AnimeDrawer
        open={animeDrawerState.open}
        anime_id={animeDrawerState.anime_id}
        onClose={handleCloseAnimeDrawer}
        nodes={graphDataState.nodes}
        nodeColor={graphNodeColorState}
      />
    </>
  );
};

export default Home;
