import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { memo, useState } from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart as SChart,
  Scatter,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import ChartNodeDialog from '@/src/components/dialogs/ChartNodeDialog';
import { Node } from '@/src/components/graphs/types';
import theme from '@/src/components/theme';

type ScatterChartData = {
  x: number;
  y: string;
  z: number;
  nodes: Node[];
};

type ScatterChartConfig = {
  xName: string;
  yName: string;
  zName: string;
};

const ScatterChart = memo(function ScatterChart({
  data,
  config,
}: {
  data: ScatterChartData[];
  config: ScatterChartConfig;
}) {
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogData, setDialogData] = useState<Node[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDialogOpen = () => setDialogOpen(!dialogOpen);

  const onClick = (d: any) => {
    if (!d) return;
    setDialogTitle(`${d.node.y} ${d.node.x} (${d.nodes.length.toLocaleString()})`);
    setDialogData(d.nodes);
    toggleDialogOpen();
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
          <Scatter data={data} fill="white" onClick={onClick} />
        </SChart>
      </ResponsiveContainer>
      <ChartNodeDialog title={dialogTitle} data={dialogData} open={dialogOpen} toggleOpen={toggleDialogOpen} />
    </>
  );
});

export default ScatterChart;

const ChartTooltip = ({ active, payload }: TooltipContentProps<any, any>) => {
  if (!(active && payload && payload.length)) return;
  return (
    <Paper elevation={3} sx={{ padding: 0.5 }}>
      <Grid container>
        {payload.map((p) => (
          <Grid size={12} key={p.name}>
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
};
