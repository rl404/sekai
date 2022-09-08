import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RChart, ResponsiveContainer, Tooltip } from 'recharts';
import { theme } from '../theme';
import ChartTooltip from './ChartTooltip';

interface RadarChartData {
  label: string;
  value: number;
}

interface RadarChartConfig {
  valueName: string;
}

const RadarChart = ({ data, config }: { data: Array<RadarChartData>; config?: RadarChartConfig }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }}>
        <PolarGrid stroke={theme.palette.grey[700]} strokeDasharray="5 5" />
        <Tooltip content={ChartTooltip} cursor={{ stroke: '#2196f3' }} />
        <PolarAngleAxis dataKey="label" stroke={theme.palette.grey[500]} />
        <Radar dataKey="value" fill="white" name={config?.valueName} />
      </RChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;
