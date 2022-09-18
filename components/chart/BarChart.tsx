import {
  ResponsiveContainer,
  BarChart as BChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Cell,
  Tooltip,
  LabelList,
} from 'recharts';
import { GraphNode } from '../../types/Types';
import ChartNodeDialog from '../dialog/ChartNodeDialog';
import { theme } from '../theme';
import ChartTooltip from './ChartTooltip';
import * as React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color: string;
  nodes: Array<GraphNode>;
}

interface BarChartConfig {
  valueName: string;
  nodeColor: any;
  showAnimeDrawer: (anime_id: number, force: boolean) => void;
}

const BarChart = ({ data, config }: { data: Array<BarChartData>; config: BarChartConfig }) => {
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
        <BChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }} onClick={handleClick}>
          <Tooltip content={ChartTooltip} cursor={{ fill: theme.palette.grey[800] }} />
          <CartesianGrid strokeDasharray="5 5" stroke={theme.palette.grey[700]} />
          <XAxis dataKey="label" stroke={theme.palette.grey[500]} />
          <YAxis stroke={theme.palette.grey[500]} />
          <Bar dataKey="value" name={config.valueName}>
            <LabelList formatter={(a: number) => a.toLocaleString()} position="top" />
            {data.map((v, i) => (
              <Cell key={`cell-${i}`} fill={v.color || 'white'} />
            ))}
          </Bar>
        </BChart>
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

export default BarChart;
