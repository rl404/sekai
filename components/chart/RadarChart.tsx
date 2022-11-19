import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RChart, ResponsiveContainer, Tooltip } from 'recharts';
import { theme } from '../theme';
import ChartTooltip from './ChartTooltip';
import * as React from 'react';
import { GraphNode } from '../../types/Types';
import ChartNodeDialog from '../dialog/ChartNodeDialog';

interface RadarChartData {
  label: string;
  value: number;
}

interface RadarChartConfig {
  valueName: string;
  nodeColor: any;
}

const RadarChart = ({ data, config }: { data: Array<RadarChartData>; config: RadarChartConfig }) => {
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
        <RChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }} onClick={handleClick}>
          <PolarGrid stroke={theme.palette.grey[700]} strokeDasharray="5 5" />
          <Tooltip content={ChartTooltip} cursor={{ stroke: '#2196f3' }} />
          <PolarAngleAxis dataKey="label" stroke={theme.palette.grey[500]} />
          <Radar dataKey="value" fill="white" name={config.valueName} />
        </RChart>
      </ResponsiveContainer>
      <ChartNodeDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={dialogTitle}
        nodes={dialogData}
        nodeColor={config.nodeColor}
      />
    </>
  );
};

export default RadarChart;
