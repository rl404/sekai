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
import { theme } from '../theme';
import ChartTooltip from './ChartTooltip';

interface BarLineChartData {
  label: string;
  valueBar: number;
  valueLine1: number;
  valueLine2: number;
  color?: string;
}

interface BarLineChartConfig {
  valueBarName: string;
  valueLine1Name: string;
  valueLine2Name: string;
  useBrush?: boolean;
  brushIndex?: number;
}

const BarLineChart = ({ data, config }: { data: Array<BarLineChartData>; config?: BarLineChartConfig }) => {
  var minScore = Math.min(...data.filter((o) => o.valueLine1 > 0).map((o) => o.valueLine1));
  var maxScore = Math.max(...data.filter((o) => o.valueLine1 > 0).map((o) => o.valueLine1));

  if (minScore - 0.5 > 0) minScore -= 0.5;
  if (maxScore + 0.5 <= 10) maxScore += 0.5;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }}>
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
          {/* <LabelList formatter={(a: number) => a.toLocaleString()} position="top" /> */}
          {data.map((v, i) => (
            <Cell key={`cell-${i}`} fill={v.color || 'white'} />
          ))}
        </Bar>
        <Line yAxisId="right" dataKey="valueLine1" stroke="#2196f3" name={config?.valueLine1Name} />
        <Line yAxisId="right" dataKey="valueLine2" stroke="#4caf50" name={config?.valueLine2Name} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default BarLineChart;
