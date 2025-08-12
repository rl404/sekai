import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Fragment, memo } from 'react';
import StatusCircle from '@/src/components/circles/StatusCircle';
import { useCtx } from '@/src/components/context';
import { Node } from '@/src/components/graphs/types';

const ChartNodeDialog = memo(function ChartNodeDialog({
  title,
  data,
  open,
  toggleOpen,
}: {
  title: string;
  data: Node[];
  open: boolean;
  toggleOpen: () => void;
}) {
  const ctx = useCtx();
  return (
    <Dialog open={open} onClose={toggleOpen} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {data.map((n) => (
            <Fragment key={n.id}>
              <Grid size={1}>
                <StatusCircle status={n.userAnimeStatus} />
              </Grid>
              <Grid size={11}>
                <Link
                  color="inherit"
                  underline="hover"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => ctx.onOpenDrawer(n.id)}
                >
                  {n.title}
                </Link>
              </Grid>
            </Fragment>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
});

export default ChartNodeDialog;
