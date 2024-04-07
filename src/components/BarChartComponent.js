// components/BarChartComponent.js
import { BarChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

export const BarChartComponent = ({ names, counts, label, size }) => {

  return (
    <BarChart
      yAxis={[{ label: label }]}
      xAxis={[{ scaleType: "band", data: names, tickLabelStyle: { fontSize: size } }]}
      series={[{ data: counts }]}
      width={500}
      height={300}
      sx={{
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
          transform: "translateX(-10px)",
        },
      }}
    />
  );
};
