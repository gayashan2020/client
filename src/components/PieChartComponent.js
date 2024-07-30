// src/components/PieChartComponent.js
import React from "react";
import { PieChart } from "@mui/x-charts";

const formatLabel = (label) => {
  return label?.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase() || label);
};

const PieChartComponent = ({ data }) => {
  return (
    <PieChart
      series={[
        {
          data: data.map((item, index) => ({
            id: index,
            value: item.count,
            label: formatLabel(item.occupation)
          })),
          innerRadius: 57,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 180,
          cx: 150,
          cy: 150,
        },
      ]}
      width={500}
      height={500}
    />
  );
};

export default PieChartComponent;
