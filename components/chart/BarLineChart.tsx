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
import * as React from 'react';
import ChartTooltip from './ChartTooltip';
import { GraphNode } from '../../types/Types';
import ChartNodeDialog from '../dialog/ChartNodeDialog';

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
  nodeColor: any;
  showAnimeDrawer: (anime_id: number, force: boolean) => void;
}

const BarLineChart = ({ data, config }: { data: Array<BarLineChartData>; config: BarLineChartConfig }) => {
  var minScore = Math.min(...data.filter((o) => o.valueLine1 > 0).map((o) => o.valueLine1));
  var maxScore = Math.max(...data.filter((o) => o.valueLine1 > 0).map((o) => o.valueLine1));

  if (minScore - 0.5 > 0) minScore -= 0.5;
  if (maxScore + 0.5 <= 10) maxScore += 0.5;

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogData, setdialogData] = React.useState<Array<GraphNode>>([]);

  const handleClick = (d: any) => {
    if (!d) return;
    setDialogTitle(`${d.activeLabel} (${d.activePayload[0].payload.nodes.length.toLocaleString()})`);
    setdialogData(
      d.activePayload[0].payload.nodes.sort((a: GraphNode, b: GraphNode) => a.title.localeCompare(b.title)),
    );
    handleOpenDialog();
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }} onClick={handleClick}>
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
      <ChartNodeDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={dialogTitle}
        nodes={dialogData}
        nodeColor={config.nodeColor}
        showAnimeDrawer={config.showAnimeDrawer}
      />
    </>
  );
};

export default BarLineChart;
