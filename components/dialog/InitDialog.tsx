import * as React from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { GraphData, GraphLink, GraphNode, UserAnimeRelationLink, UserAnimeRelationNode } from '../../types/Types';

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
    loading: true,
  });

  const handleChangeUsername = (e: any) => {
    setFormState({ ...formState, username: e.target.value, error: '' });
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit = async (submitCount: number = 0) => {
    if (formState.username === '') {
      setFormState({ ...formState, error: 'required username' });
      return;
    }

    setFormState({ ...formState, loading: true });

    await axios
      .get(`/api/user/${formState.username}/anime/relations`)
      .then(async (resp) => {
        if (resp.status === 202) {
          if (submitCount >= 2) {
            setFormState({
              ...formState,
              loading: false,
              error: 'invalid username or empty anime list',
            });
            return;
          }

          setFormState({ ...formState, loading: true, error: 'retrieving anime list...' });
          await sleep(10000);
          setFormState({ ...formState, loading: false, error: '' });
          onSubmit(submitCount + 1);
          return;
        }

        const nodes: Array<GraphNode> = resp.data.data.nodes.map((n: UserAnimeRelationNode): GraphNode => {
          return {
            id: n.anime_id,
            anime_id: n.anime_id,
            title: n.title,
            status: n.status,
            type: n.type,
            score: n.score,
            source: n.source,
            start_year: n.start_year,
            episode_count: n.episode_count,
            episode_duration: n.episode_duration,
            season: n.season,
            season_year: n.season_year,
            user_anime_status: n.user_anime_status,
            user_anime_score: n.user_anime_score,
            user_episode_count: n.user_episode_count,
            neighbors: [],
            links: [],
          };
        });

        const links: Array<GraphLink> = resp.data.data.links.map((l: UserAnimeRelationLink): GraphLink => {
          const link = {
            source: l.anime_id1,
            sourceID: l.anime_id1,
            target: l.anime_id2,
            targetID: l.anime_id2,
            relation: l.relation,
          };

          const a = nodes.find((n: any) => n.id === link.source);
          const b = nodes.find((n: any) => n.id === link.target);

          a && !a.neighbors && (a.neighbors = []);
          b && !b.neighbors && (b.neighbors = []);

          a && b && a.neighbors.push(b);
          a && b && b.neighbors.push(a);

          a && !a.links && (a.links = []);
          b && !b.links && (b.links = []);

          a && a.links.push(link);
          b && b.links.push(link);

          return link;
        });

        nodes.forEach((n) => {
          n.neighbors = Array.from(new Set(n.neighbors));
          n.links = Array.from(new Set(n.links));
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
          error: !error.response ? error.message : error.response.data?.message,
        });
      });
  };

  React.useEffect(() => {
    axios
      .get(`/api`)
      .then(() => {
        setFormState({ ...formState, loading: false });
      })
      .catch((error) => {
        setFormState({ ...formState, error: 'api is down' });
      });
  }, []);

  return (
    <Dialog
      open={open}
      hideBackdrop
      disableEnforceFocus
      fullWidth
      maxWidth="xs"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        height: 'fit-content',
        width: '100%',
      }}
    >
      <DialogTitle>Welcome to Sekai</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <TextField
              label="MyAnimeList username"
              placeholder="rl404"
              size="small"
              fullWidth
              autoFocus
              value={formState.username}
              onChange={handleChangeUsername}
              disabled={formState.loading}
              helperText={formState.error}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit(1)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <LoadingButton fullWidth onClick={() => onSubmit(1)} loading={formState.loading}>
              Go
            </LoadingButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default InitDialog;
