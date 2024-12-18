import ChartNodeDialog from "../dialogs/ChartNodeDialog";
import { ChartNodeDialogRefType } from "../dialogs/types";
import { Node } from "../graphs/types";
import { theme } from "../theme";
import ChartTooltip from "./ChartTooltip";
import { memo, useRef, useState } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RChart, ResponsiveContainer, Tooltip } from "recharts";

interface RadarChartData {
  label: string;
  value: number;
}

interface RadarChartConfig {
  valueName: string;
}

const RadarChart = memo(({ data, config }: { data: RadarChartData[]; config: RadarChartConfig }) => {
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
        <RChart data={data} margin={{ top: 15, right: 10, left: 0, bottom: 15 }} onClick={onClick}>
          <PolarGrid stroke={theme.palette.grey[700]} strokeDasharray="5 5" />
          <Tooltip content={ChartTooltip} cursor={{ stroke: "#2196f3" }} />
          <PolarAngleAxis dataKey="label" stroke={theme.palette.grey[500]} />
          <Radar dataKey="value" fill="white" name={config.valueName} />
        </RChart>
      </ResponsiveContainer>
      <ChartNodeDialog ref={ref} title={dialogTitle} data={dialogData} />
    </>
  );
});

export default RadarChart;
