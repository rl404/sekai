import ChartNodeDialog from "../dialogs/ChartNodeDialog";
import { ChartNodeDialogRefType } from "../dialogs/types";
import { Node } from "../graphs/types";
import { theme } from "../theme";
import ChartTooltip from "./ChartTooltip";
import { memo, useRef, useState } from "react";
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
} from "recharts";

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

const BarLineChart = memo(({ data, config }: { data: BarLineChartData[]; config: BarLineChartConfig }) => {
  const ref = useRef<ChartNodeDialogRefType>();

  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogData, setdialogData] = useState([]);

  var minScore = Math.min(...data.filter((o) => o.valueLine1 > 0).map((o) => o.valueLine1));
  var maxScore = Math.max(...data.filter((o) => o.valueLine1 > 0).map((o) => o.valueLine1));

  if (minScore - 0.5 > 0) minScore -= 0.5;
  if (maxScore + 0.5 <= 10) maxScore += 0.5;

  const onClick = (d: any) => {
    if (!d) return;
    setDialogTitle(`${d.activeLabel} (${d.activePayload[0].payload.nodes.length.toLocaleString()})`);
    setdialogData(d.activePayload[0].payload.nodes.sort((a: Node, b: Node) => a.title.localeCompare(b.title)));
    ref.current?.setOpen(true);
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }} onClick={onClick}>
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
            {data.map((v, i) => (
              <Cell key={`cell-${i}`} fill={v.color || "white"} />
            ))}
          </Bar>
          <Line yAxisId="right" dataKey="valueLine1" stroke="#2196f3" name={config?.valueLine1Name} />
          <Line yAxisId="right" dataKey="valueLine2" stroke="#4caf50" name={config?.valueLine2Name} />
        </ComposedChart>
      </ResponsiveContainer>
      <ChartNodeDialog ref={ref} title={dialogTitle} data={dialogData} />
    </>
  );
});

export default BarLineChart;
