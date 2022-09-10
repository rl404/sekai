import { ResponsiveContainer, BarChart as BChart, Bar } from 'recharts';
import { theme } from '../theme';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const MiniBarChart = ({ data }: { data: Array<ChartData> }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" fill={theme.palette.grey[500]} />
      </BChart>
    </ResponsiveContainer>
  );
};

export default MiniBarChart;
