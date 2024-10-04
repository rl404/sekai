import ChartNodeDialog from "../dialogs/ChartNodeDialog";
import { ChartNodeDialogRefType } from "../dialogs/types";
import { Node } from "../graphs/types";
import { theme } from "../theme";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { memo, useRef, useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart as SChart,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

interface ScatterChartData {
  x: number;
  y: string;
  z: number;
}

interface ScatterChartConfig {
  xName: string;
  yName: string;
  zName: string;
}

const ScatterChart = memo(({ data, config }: { data: ScatterChartData[]; config: ScatterChartConfig }) => {
  const ref = useRef<ChartNodeDialogRefType>();

  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogData, setdialogData] = useState([]);

  const onClick = (d: any) => {
    if (!d) return;
    setDialogTitle(`${d.node.y} ${d.node.x} (${d.nodes.length.toLocaleString()})`);
    setdialogData(d.nodes.sort((a: Node, b: Node) => a.title.localeCompare(b.title)));
    ref.current?.setOpen(true);
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <SChart margin={{ top: 15, right: 10, left: 0, bottom: 15 }}>
          <Tooltip content={ChartTooltip} cursor={false} />
          <CartesianGrid strokeDasharray="5 5" stroke={theme.palette.grey[700]} />
          <XAxis
            type="number"
            dataKey="x"
            name={config.xName}
            domain={["dataMin - 1", "dataMax + 1"]}
            tickCount={Math.max(...data.map((o) => o.x)) - Math.min(...data.map((o) => o.x))}
          />
          <YAxis type="category" dataKey="y" name={config.yName} width={80} allowDuplicatedCategory={false} />
          <ZAxis type="number" dataKey="z" name={config.zName} range={[10, 500]} />
          <Scatter data={data} fill="white" onClick={onClick} />
        </SChart>
      </ResponsiveContainer>
      <ChartNodeDialog ref={ref} title={dialogTitle} data={dialogData} />
    </>
  );
});

export default ScatterChart;

const ChartTooltip = ({ active, payload }: TooltipProps<any, any>) => {
  if (!(active && payload && payload.length)) return;
  return (
    <Paper elevation={3} sx={{ padding: 0.5 }}>
      <Grid container>
        {payload.map((p) => (
          <Grid size={12} key={p.name}>
            {`${p.name} : `}
            {typeof p.value === "string"
              ? p.value
              : p.value % 1 != 0
              ? p.value.toFixed(2).toLocaleString()
              : p.name === "year"
              ? p.value
              : p.value.toLocaleString()}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
