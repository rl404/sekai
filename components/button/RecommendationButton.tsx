import { Button } from '@mui/material';
import * as React from 'react';
import { GraphLink, GraphNode } from '../../types/Types';
import RecommendationDialog from '../dialog/RecommendationDialog';

const RecommendationButton = React.memo(
  ({
    username,
    nodes,
    links,
    nodeColor,
  }: {
    username: string;
    nodes: Array<GraphNode>;
    links: Array<GraphLink>;
    nodeColor: any;
  }) => {
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
          Show Recommendations
        </Button>
        <RecommendationDialog
          open={open}
          onClose={handleCloseDialog}
          username={username}
          nodes={nodes}
          links={links}
          nodeColor={nodeColor}
        />
      </>
    );
  },
);

export default RecommendationButton;
