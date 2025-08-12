import { memo, useState } from 'react';
import {
  BarChart as BChart,
  Bar,
  CartesianGrid,
  Cell,
  LabelList,
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

type BarChartData = {
  label: string;
  value: number;
  color: string;
  nodes: Node[];
};

type BarChartConfig = {
  valueName: string;
};

const BarChart = memo(function BarChart({ data, config }: { data: BarChartData[]; config: BarChartConfig }) {
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogData, setDialogData] = useState<Node[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDialogOpen = () => setDialogOpen(!dialogOpen);

  const onClick = (d: MouseHandlerDataParam) => {
    if (!d) return;
    setDialogTitle(`${d.activeLabel} (${data[d.activeIndex as number].nodes.length.toLocaleString()})`);
    setDialogData(data[d.activeIndex as number].nodes);
    toggleDialogOpen();
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BChart
          data={data.map((d) => ({ ...d, nodes: [] }))}
          margin={{ top: 15, right: 10, left: 0, bottom: 15 }}
          onClick={onClick}
        >
          <Tooltip content={ChartTooltip} cursor={{ fill: theme.palette.grey[800] }} />
          <CartesianGrid strokeDasharray="5 5" stroke={theme.palette.grey[700]} />
          <XAxis dataKey="label" stroke={theme.palette.grey[500]} />
          <YAxis stroke={theme.palette.grey[500]} />
          <Bar dataKey="value" name={config.valueName}>
            <LabelList position="top" formatter={(a) => a?.toLocaleString()} />
            {data.map((v, i) => (
              <Cell key={`cell-${i}`} fill={v.color || 'white'} />
            ))}
          </Bar>
        </BChart>
      </ResponsiveContainer>
      <ChartNodeDialog title={dialogTitle} data={dialogData} open={dialogOpen} toggleOpen={toggleDialogOpen} />
    </>
  );
});

export default BarChart;
