// src/components/LineChartComponent.js
import React from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts";

const LineChartComponent = ({ data, labels }) => {
  return (
    <LineChart
      width={500}
      height={300}
      series={[{ data, label: "CPD Points", area: true, showMark: false }]}
      xAxis={[{ scaleType: "point", data: labels }]}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          display: "none",
        },
      }}
    />
  );
};

export default LineChartComponent;
