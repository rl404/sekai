import { memo, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import theme from '@/src/components/theme';

const MiniAreaChart = memo(function MiniAreaChart({ data }: { data: { value: number }[] }) {
  const minScore = useMemo(() => {
    let tmpScore = Math.min(...data.filter((o) => o.value > 0).map((o) => o.value));
    if (tmpScore - 0.5 > 0) tmpScore -= 0.5;
    return tmpScore;
  }, [data]);

  const maxScore = useMemo(() => {
    let tmpScore = Math.max(...data.filter((o) => o.value > 0).map((o) => o.value));
    if (tmpScore + 0.5 <= 10) tmpScore += 0.5;
    return tmpScore;
  }, [data]);

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
