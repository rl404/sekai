import { Button } from '@mui/material';
import * as React from 'react';
import { GraphNode } from '../../types/Types';
import StatsDialog from '../dialog/StatsDialog';

const StatsButton = ({ username, nodes, nodeColor }: { username: string; nodes: Array<GraphNode>; nodeColor: any }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Button fullWidth onClick={handleOpenDialog}>
        Show Stats
      </Button>
      <StatsDialog open={open} onClose={handleCloseDialog} username={username} nodes={nodes} nodeColor={nodeColor} />
    </>
  );
};

export default StatsButton;
