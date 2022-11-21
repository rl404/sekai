import { Button } from '@mui/material';
import * as React from 'react';
import { GraphNode } from '../../types/Types';
import ListDialog from '../dialog/ListDialog';

const ListButton = React.memo(
  ({ username, nodes, nodeColor }: { username: string; nodes: Array<GraphNode>; nodeColor: any }) => {
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
          Show Anime List
        </Button>
        <ListDialog open={open} onClose={handleCloseDialog} username={username} nodes={nodes} nodeColor={nodeColor} />
      </>
    );
  },
);

export default ListButton;
