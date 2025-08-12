import { memo, useState } from 'react';
import { PolarAngleAxis, PolarGrid, RadarChart as RChart, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { MouseHandlerDataParam } from 'recharts/types/synchronisation/types';
import ChartTooltip from '@/src/components/charts/ChartTooltip';
import ChartNodeDialog from '@/src/components/dialogs/ChartNodeDialog';
import { Node } from '@/src/components/graphs/types';
import theme from '@/src/components/theme';

type RadarChartData = {
  label: string;
  value: number;
  nodes: Node[];
};

type RadarChartConfig = {
  valueName: string;
};

const RadarChart = memo(function RadarChart({ data, config }: { data: RadarChartData[]; config: RadarChartConfig }) {
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
        <RChart
          data={data.map((d) => ({ ...d, nodes: [] }))}
          margin={{ top: 15, right: 10, left: 0, bottom: 15 }}
          onClick={onClick}
        >
          <PolarGrid stroke={theme.palette.grey[700]} strokeDasharray="5 5" />
          <Tooltip content={ChartTooltip} cursor={{ stroke: '#2196f3' }} />
          <PolarAngleAxis dataKey="label" stroke={theme.palette.grey[500]} />
          <Radar dataKey="value" fill="white" name={config.valueName} />
        </RChart>
      </ResponsiveContainer>
      <ChartNodeDialog title={dialogTitle} data={dialogData} open={dialogOpen} toggleOpen={toggleDialogOpen} />
    </>
  );
});

export default RadarChart;
