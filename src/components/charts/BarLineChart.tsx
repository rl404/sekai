import { memo, useMemo, useState } from 'react';
import {
  Bar,
  Brush,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MouseHandlerDataParam } from 'recharts/types/synchronisation/types';
import ChartTooltip from '@/src/components/charts/ChartTooltip';
import ChartNodeDialog from '@/src/components/dialogs/ChartNodeDialog';
import { Node } from '@/src/components/graphs/types';
import theme from '@/src/components/theme';

type BarLineChartData = {
  label: string;
  valueBar: number;
  valueLine1: number;
  valueLine2: number;
  color?: string;
  nodes: Node[];
};

type BarLineChartConfig = {
  valueBarName: string;
  valueLine1Name: string;
  valueLine2Name: string;
  useBrush?: boolean;
  brushIndex?: number;
};

const BarLineChart = memo(function BarLineChart({
  data,
  config,
}: {
  data: BarLineChartData[];
  config: BarLineChartConfig;
}) {
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogData, setDialogData] = useState<Node[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDialogOpen = () => setDialogOpen(!dialogOpen);

  const minScore = useMemo(() => {
    let tmpScore = Math.min(...data.filter((o) => o.valueLine1 > 0).map((o) => o.valueLine1));
    if (tmpScore - 0.5 > 0) tmpScore -= 0.5;
    return tmpScore;
  }, [data]);

  const maxScore = useMemo(() => {
    let tmpScore = Math.max(...data.filter((o) => o.valueLine1 > 0).map((o) => o.valueLine1));
    if (tmpScore + 0.5 <= 0) tmpScore += 0.5;
    return tmpScore;
  }, [data]);

  const onClick = (d: MouseHandlerDataParam) => {
    if (!d || !d.activeLabel) return;
    const selectedData = data.find((a) => a.label === d.activeLabel);
    setDialogTitle(`${d.activeLabel} (${selectedData?.nodes.length.toLocaleString()})`);
    setDialogData(selectedData?.nodes || []);
    toggleDialogOpen();
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }} onClick={onClick}>
          <Tooltip content={ChartTooltip} cursor={{ fill: theme.palette.grey[800] }} />
          <CartesianGrid strokeDasharray="5 5" stroke={theme.palette.grey[700]} />
          <XAxis dataKey="label" stroke={theme.palette.grey[500]} />
          <YAxis yAxisId="left" stroke={theme.palette.grey[500]} />
          <YAxis yAxisId="right" stroke={theme.palette.grey[500]} orientation="right" domain={[minScore, maxScore]} />
          {config?.useBrush && (
            <Brush
              dataKey="label"
              height={20}
              startIndex={config?.brushIndex}
              fill={theme.palette.grey[900]}
              stroke={theme.palette.grey[500]}
            />
          )}
          <Bar yAxisId="left" dataKey="valueBar" name={config?.valueBarName}>
            {data.map((v, i) => (
              <Cell key={`cell-${i}`} fill={v.color || 'white'} />
            ))}
          </Bar>
          <Line yAxisId="right" dataKey="valueLine1" stroke="#2196f3" name={config?.valueLine1Name} />
          <Line yAxisId="right" dataKey="valueLine2" stroke="#4caf50" name={config?.valueLine2Name} />
        </ComposedChart>
      </ResponsiveContainer>
      <ChartNodeDialog title={dialogTitle} data={dialogData} open={dialogOpen} toggleOpen={toggleDialogOpen} />
    </>
  );
});

export default BarLineChart;
