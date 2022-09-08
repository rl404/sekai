import { ResponsiveContainer, BarChart as BChart, CartesianGrid, XAxis, YAxis, Bar, Cell, Tooltip } from 'recharts';
import { theme } from '../theme';
import ChartTooltip from './ChartTooltip';

interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartConfig {
  valueName: string;
}

const BarChart = ({ data, config }: { data: Array<BarChartData>; config?: BarChartConfig }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }}>
        <Tooltip content={ChartTooltip} cursor={{ fill: theme.palette.grey[800] }} />
        <CartesianGrid strokeDasharray="5 5" stroke={theme.palette.grey[700]} />
        <XAxis dataKey="label" stroke={theme.palette.grey[500]} />
        <YAxis stroke={theme.palette.grey[500]} />
        <Bar dataKey="value" name={config?.valueName}>
          {/* <LabelList formatter={(a: number) => a.toLocaleString()} position="top" /> */}
          {data.map((v, i) => (
            <Cell key={`cell-${i}`} fill={v.color || 'white'} />
          ))}
        </Bar>
      </BChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
