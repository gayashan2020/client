// components/BarChartComponent.js
import { BarChart } from "@mui/x-charts";

export const BarChartComponent = ({ names, counts, label }) => {
  return (
    <BarChart
      yAxis={[{ label: label }]}
      xAxis={[{ scaleType: "band", data: names }]}
      series={[{ data: counts }]}
      width={500}
      height={300}
    />
  );
};
