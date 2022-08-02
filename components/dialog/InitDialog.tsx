import * as React from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import {
  GraphData,
  GraphLink,
  GraphNode,
  UserAnimeRelationLink,
  UserAnimeRelationNode,
} from '../../types/Types';

const InitDialog = ({
  open,
  onClose,
  setGraphData,
  openConfigDialog,
  setConfigUsername,
}: {
  open: boolean;
  onClose: any;
  setGraphData: (data: GraphData) => void;
  openConfigDialog: () => void;
  setConfigUsername: (username: string) => void;
}) => {
  const [formState, setFormState] = React.useState({
    username: '',
    error: '',
    loading: false,
  });

  const handleChangeUsername = (e: any) => {
    setFormState({ ...formState, username: e.target.value, error: '' });
  };

  const onSubmit = async () => {
    if (formState.username === '') {
      setFormState({ ...formState, error: 'required username' });
      return;
    }

    setFormState({ ...formState, loading: true });

    await axios
      .get(`/api/user/${formState.username}/anime/relations`)
      .then((resp) => {
        const nodes = resp.data.data.nodes.map((n: UserAnimeRelationNode): GraphNode => {
          return {
            id: n.anime_id,
            anime_id: n.anime_id,
            title: n.title,
            status: n.status,
            type: n.type,
            score: n.score,
            user_anime_status: n.user_anime_status,
            neighbors: [],
            links: [],
          };
        });

        const links = resp.data.data.links.map((l: UserAnimeRelationLink): GraphLink => {
          const link = {
            source: l.anime_id1,
            target: l.anime_id2,
            relation: l.relation,
          };

          const a = nodes.find((n: any) => n.id === link.source);
          const b = nodes.find((n: any) => n.id === link.target);

          !a.neighbors && (a.neighbors = []);
          !b.neighbors && (b.neighbors = []);

          a.neighbors.push(b);
          b.neighbors.push(a);

          !a.links && (a.links = []);
          !b.links && (b.links = []);

          a.links.push(link);
          b.links.push(link);

          return link;
        });

        setGraphData({
          nodes: nodes,
          links: links,
        });

        setFormState({ ...formState, loading: false });
        onClose();
        openConfigDialog();
        setConfigUsername(formState.username);
      })
      .catch((error) => {
        setFormState({
          ...formState,
          loading: false,
          error: error.response.data?.message,
        });
      });
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Welcome to Sekai</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <TextField
              label="MyAnimeList username"
              placeholder="rl404"
              size="small"
              fullWidth
              value={formState.username}
              onChange={handleChangeUsername}
              disabled={formState.loading}
            />
          </Grid>
          <Grid item xs={3}>
            <LoadingButton fullWidth onClick={onSubmit} loading={formState.loading}>
              Go
            </LoadingButton>
          </Grid>
          {formState.error !== '' && (
            <Grid item xs={12}>
              {formState.error}
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default InitDialog;
