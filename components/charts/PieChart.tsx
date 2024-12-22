import ChartNodeDialog from "../dialogs/ChartNodeDialog";
import { ChartNodeDialogRefType } from "../dialogs/types";
import { Node } from "../graphs/types";
import { memo, useRef, useState } from "react";
import { ResponsiveContainer, PieChart as PChart, Pie, Sector } from "recharts";

interface PieChartData {
  label: string;
  value: number;
}

interface PieChartConfig {
  valueName: string;
}

const PieChart = memo(({ data, config }: { data: PieChartData[]; config: PieChartConfig }) => {
  const ref = useRef<ChartNodeDialogRefType>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogData, setdialogData] = useState([]);

  const onHover = (_: any, i: number) => {
    setActiveIndex(i);
  };

  const onClick = (d: any) => {
    if (!d) return;
    setDialogTitle(`${d.label} (${d.nodes.length.toLocaleString()})`);
    setdialogData(d.nodes.sort((a: Node, b: Node) => a.title.localeCompare(b.title)));
    ref.current?.setOpen(true);
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PChart margin={{ top: 15, right: 10, left: 0, bottom: 15 }}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            activeIndex={activeIndex}
            activeShape={PieActiveShape}
            onMouseEnter={onHover}
            onClick={onClick}
            name={config.valueName}
          />
        </PChart>
      </ResponsiveContainer>
      <ChartNodeDialog ref={ref} title={dialogTitle} data={dialogData} />
    </>
  );
});

export default PieChart;

const PieActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="white">
        {payload.label}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill="white">
        {`${payload.name} : ${payload.value.toLocaleString()}`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="white"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill="#2196f3"
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#2196f3" fill="none" />
      <circle cx={ex} cy={ey} r={2} fill="white" stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={5} textAnchor={textAnchor} fill="#999">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};
