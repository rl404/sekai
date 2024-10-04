import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { TooltipProps } from "recharts";

const ChartTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (!(active && payload && payload.length)) return;
  return (
    <Paper elevation={3} sx={{ padding: 0.5 }}>
      <Grid container>
        <Grid size={12}>{label}</Grid>
        {payload.map((p) => (
          <Grid size={12} key={p.name}>
            {`${p.name} : `}
            {typeof p.value === "string"
              ? p.value
              : !p.value
              ? 0
              : p.value % 1 != 0
              ? p.value.toFixed(2).toLocaleString()
              : p.value.toLocaleString()}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ChartTooltip;
