'use client';

import Main from '@/components/Main';
import ConfigDialog from '@/components/dialogs/ConfigDialog';
import InitDialog from '@/components/dialogs/InitDialog';
import ForceGraph from '@/components/graphs/ForceGraph';
import GitHubIcon from '@mui/icons-material/GitHub';
import IconButton from '@mui/material/IconButton';

const style = {
  githubIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
};

export default function Home() {
  return (
    <Main>
      <ForceGraph />

      <IconButton href="https://github.com/rl404/sekai" target="_blank" sx={style.githubIcon}>
        <GitHubIcon />
      </IconButton>

      <InitDialog />

      <ConfigDialog />
    </Main>
  );
}
