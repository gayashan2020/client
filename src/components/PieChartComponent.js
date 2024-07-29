// components/PieChartComponent.js
import { PieChart } from "@mui/x-charts";

export const PieChartComponent = ({ data }) => {
    return (
        <PieChart
            series={[
                {
                    data: data.map((item, index) => ({
                        id: index,
                        value: item.count,
                        label: item.occupation
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
            width={400}
            height={200}
        />
    );
};