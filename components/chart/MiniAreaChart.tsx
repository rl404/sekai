import * as React from 'react';
import { ResponsiveContainer, AreaChart as AChart, Area, YAxis } from 'recharts';
import { theme } from '../theme';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const MiniAreaChart = React.memo(({ data }: { data: Array<ChartData> }) => {
  var minScore = Math.min(...data.filter((o) => o.value > 0).map((o) => o.value));
  var maxScore = Math.max(...data.filter((o) => o.value > 0).map((o) => o.value));

  if (minScore - 0.5 > 0) minScore -= 0.5;
  if (maxScore + 0.5 <= 10) maxScore += 0.5;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <YAxis domain={[minScore, maxScore]} hide />
        <Area dataKey="value" fill={theme.palette.grey[500]} />
      </AChart>
    </ResponsiveContainer>
  );
});

export default MiniAreaChart;
