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
                },
            ]}
            width={400}
            height={200}
        />
    );
};