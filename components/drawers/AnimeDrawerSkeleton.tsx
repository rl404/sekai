import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

const AnimeDrawerSkeleton = memo(() => {
  return (
    <>
      <Grid size={12}>
        <Typography variant="h5" gutterBottom>
          <Skeleton />
        </Typography>
        <Divider />
      </Grid>
      <Grid size={12}>
        <Skeleton variant="rectangular" width={340} height={480} sx={{ margin: 'auto' }} />
      </Grid>
      <Grid size={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid size={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid size={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid size={6}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid size={6}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid size={12}>
        <Divider sx={{ marginBottom: 1 }}>
          <Skeleton width={100} />
        </Divider>
        <Typography>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton width="60%" />
        </Typography>
      </Grid>
      <Grid size={12}>
        <Divider sx={{ marginBottom: 1 }}>
          <Skeleton width={100} />
        </Divider>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Skeleton variant="rectangular" width={60} />
          <Skeleton variant="rectangular" width={60} />
          <Skeleton variant="rectangular" width={60} />
        </Stack>
      </Grid>
      <Grid size={12} container spacing={2}>
        <Grid size={12}>
          <Divider>
            <Skeleton width={100} />
          </Divider>
        </Grid>
        <Grid size={3}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid size={9}>
          <Skeleton variant="rectangular" width="50%" />
        </Grid>
        <Grid size={3} />
        <Grid size={9}>
          <Skeleton variant="rectangular" width="90%" />
        </Grid>
        <Grid size={3}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid size={9}>
          <Skeleton variant="rectangular" width="70%" />
        </Grid>
        <Grid size={3} />
        <Grid size={9}>
          <Skeleton variant="rectangular" width="60%" />
        </Grid>
      </Grid>
    </>
  );
});

export default AnimeDrawerSkeleton;
