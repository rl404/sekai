import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { ChangeEvent, memo, useEffect, useState } from 'react';
import { useDispatchCtx } from '@/src/components/context';
import { getNodesLinks } from '@/src/libs/graph';
import { getAxiosError, sleep } from '@/src/libs/utils';

const dialogStyle = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 'fit-content',
  width: '100%',
};

const InitDialog = memo(function InitDialog() {
  const dispatch = useDispatchCtx();

  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError('');
  };

  const onSubmit = async (submitCount: number = 0) => {
    if (username === '') {
      setError('required username');
      return;
    }

    setLoading(true);
    setError('');

    await axios
      .get(`/api/user/${username}/anime/relations`)
      .then(async (resp) => {
        if (resp.status === 202) {
          if (submitCount >= 2) {
            setError('invalid username or empty anime list');
            return;
          }

          setError('retrieving anime list...');
          await sleep(10000);
          setLoading(false);
          setError('');
          onSubmit(submitCount + 1);
          return;
        }

        dispatch({ type: 'username', value: username });
        dispatch({ type: 'graphData', value: getNodesLinks(resp.data.data) });
        dispatch({ type: 'dialogConfigOpen', value: true });

        setOpen(false);
      })
      .catch((error) => setError(getAxiosError(error)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    axios.get(`/api`).catch(() => setError('api is down'));
  }, []);

  return (
    <Dialog open={open} hideBackdrop fullWidth maxWidth="xs" sx={dialogStyle}>
      <DialogTitle>Welcome to Sekai</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 9 }}>
            <TextField
              label="MyAnimeList username"
              placeholder="rl404"
              size="small"
              fullWidth
              autoFocus
              value={username}
              onChange={onChangeUsername}
              disabled={loading}
              helperText={error}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit(1)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button fullWidth onClick={() => onSubmit(1)} loading={loading}>
              Go
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});

export default InitDialog;
