import { memo } from 'react';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';
import theme from '@/src/components/theme';

const MiniBarChart = memo(function MiniBarChart({ data }: { data: { value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" fill={theme.palette.grey[500]} />
      </BarChart>
    </ResponsiveContainer>
  );
});

export default MiniBarChart;
