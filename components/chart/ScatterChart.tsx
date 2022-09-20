import { Grid, Paper } from '@mui/material';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart as SChart,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import * as React from 'react';
import { theme } from '../theme';
import { GraphNode } from '../../types/Types';
import ChartNodeDialog from '../dialog/ChartNodeDialog';

interface ScatterChartData {
  x: number;
  y: string;
  z: number;
}

interface ScatterChartConfig {
  xName: string;
  yName: string;
  zName: string;
  nodeColor: any;
  showAnimeDrawer: (anime_id: number) => void;
}

const ScatterChart = ({ data, config }: { data: Array<ScatterChartData>; config: ScatterChartConfig }) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogData, setdialogData] = React.useState<Array<GraphNode>>([]);

  const handleClick = (d: any) => {
    if (!d) return;
    console.log(d);
    setDialogTitle(`${d.node.y} ${d.node.x} (${d.nodes.length.toLocaleString()})`);
    setdialogData(d.nodes.sort((a: GraphNode, b: GraphNode) => a.title.localeCompare(b.title)));
    handleOpenDialog();
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <SChart margin={{ top: 15, right: 10, left: 0, bottom: 15 }}>
          <Tooltip content={ChartTooltip} cursor={false} />
          <CartesianGrid strokeDasharray="5 5" stroke={theme.palette.grey[700]} />
          <XAxis
            type="number"
            dataKey="x"
            name={config.xName}
            domain={['dataMin - 1', 'dataMax + 1']}
            tickCount={Math.max(...data.map((o) => o.x)) - Math.min(...data.map((o) => o.x))}
          />
          <YAxis type="category" dataKey="y" name={config.yName} width={80} allowDuplicatedCategory={false} />
          <ZAxis type="number" dataKey="z" name={config.zName} range={[10, 500]} />
          <Scatter data={data} fill="white" onClick={handleClick} />
        </SChart>
      </ResponsiveContainer>
      <ChartNodeDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={dialogTitle}
        nodes={dialogData}
        nodeColor={config.nodeColor}
        showAnimeDrawer={config.showAnimeDrawer}
      />
    </>
  );
};

export default ScatterChart;

const ChartTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ padding: 0.5 }}>
        <Grid container>
          {payload.map((p) => (
            <Grid item xs={12} key={p.name}>
              {`${p.name} : `}
              {typeof p.value === 'string'
                ? p.value
                : p.value % 1 != 0
                ? p.value.toFixed(2).toLocaleString()
                : p.name === 'year'
                ? p.value
                : p.value.toLocaleString()}
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  return null;
};
