import ChartNodeDialog from "../dialogs/ChartNodeDialog";
import { ChartNodeDialogRefType } from "../dialogs/types";
import { Node } from "../graphs/types";
import { theme } from "../theme";
import ChartTooltip from "./ChartTooltip";
import { memo, useRef, useState } from "react";
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
} from "recharts";

interface BarChartData {
  label: string;
  value: number;
  color: string;
  nodes: Node[];
}

interface BarChartConfig {
  valueName: string;
}

const BarChart = memo(({ data, config }: { data: BarChartData[]; config: BarChartConfig }) => {
  const ref = useRef<ChartNodeDialogRefType>(null);

  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogData, setdialogData] = useState([]);

  const onClick = (d: any) => {
    if (!d) return;
    setDialogTitle(`${d.activeLabel} (${d.activePayload[0].payload.nodes.length.toLocaleString()})`);
    setdialogData(d.activePayload[0].payload.nodes.sort((a: Node, b: Node) => a.title.localeCompare(b.title)));
    ref.current?.setOpen(true);
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }} onClick={onClick}>
          <Tooltip content={ChartTooltip} cursor={{ fill: theme.palette.grey[800] }} />
          <CartesianGrid strokeDasharray="5 5" stroke={theme.palette.grey[700]} />
          <XAxis dataKey="label" stroke={theme.palette.grey[500]} />
          <YAxis stroke={theme.palette.grey[500]} />
          <Bar dataKey="value" name={config.valueName}>
            <LabelList formatter={(a: number) => a.toLocaleString()} position="top" />
            {data.map((v, i) => (
              <Cell key={`cell-${i}`} fill={v.color || "white"} />
            ))}
          </Bar>
        </BChart>
      </ResponsiveContainer>
      <ChartNodeDialog ref={ref} title={dialogTitle} data={dialogData} />
    </>
  );
});

export default BarChart;
