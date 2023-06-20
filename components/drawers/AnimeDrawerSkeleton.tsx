import { Divider, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { memo } from "react";

const AnimeDrawerSkeleton = memo(() => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          <Skeleton />
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" width={340} height={480} sx={{ margin: "auto" }} />
      </Grid>
      <Grid item xs={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Divider>
          <Skeleton width={50} />
        </Divider>
        <Typography variant="h6">
          <Skeleton />
        </Typography>
      </Grid>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <Divider sx={{ marginBottom: 1 }}>
          <Skeleton width={100} />
        </Divider>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Skeleton variant="rectangular" width={60} />
          <Skeleton variant="rectangular" width={60} />
          <Skeleton variant="rectangular" width={60} />
        </Stack>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12}>
          <Divider>
            <Skeleton width={100} />
          </Divider>
        </Grid>
        <Grid item xs={3}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid item xs={9}>
          <Skeleton variant="rectangular" width="50%" />
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={9}>
          <Skeleton variant="rectangular" width="90%" />
        </Grid>
        <Grid item xs={3}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid item xs={9}>
          <Skeleton variant="rectangular" width="70%" />
        </Grid>
        <Grid item xs={3} />
        <Grid item xs={9}>
          <Skeleton variant="rectangular" width="60%" />
        </Grid>
      </Grid>
    </>
  );
});

export default AnimeDrawerSkeleton;
