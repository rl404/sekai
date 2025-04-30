import theme from '@/components/theme';
import { memo } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

const MiniAreaChart = memo(({ data }: { data: { value: number }[] }) => {
  let minScore = Math.min(...data.filter((o) => o.value > 0).map((o) => o.value));
  let maxScore = Math.max(...data.filter((o) => o.value > 0).map((o) => o.value));

  if (minScore - 0.5 > 0) minScore -= 0.5;
  if (maxScore + 0.5 <= 10) maxScore += 0.5;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <YAxis domain={[minScore, maxScore]} hide />
        <Area dataKey="value" fill={theme.palette.grey[500]} />
      </AreaChart>
    </ResponsiveContainer>
  );
});

export default MiniAreaChart;
