'use client';

import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from '@mui/material';
import Main from '@/src/components/Main';
import ConfigDialog from '@/src/components/dialogs/ConfigDialog';
import InitDialog from '@/src/components/dialogs/InitDialog';
import ForceGraph from '@/src/components/graphs/ForceGraph';

const iconStyle = {
  position: 'absolute',
  right: 10,
  bottom: 10,
};

export default function Home() {
  return (
    <Main>
      <ForceGraph />

      <IconButton href="https://github.com/rl404/sekai" target="_blank" sx={iconStyle}>
        <GitHubIcon />
      </IconButton>

      <InitDialog />

      <ConfigDialog />
    </Main>
  );
}
