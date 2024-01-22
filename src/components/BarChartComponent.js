// components/BarChartComponent.js
import { BarChart } from "@mui/x-charts";

export const BarChartComponent = ({ data }) => {
    const cities = data.map(item => item.city);
    const counts = data.map(item => item.count);

    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: cities }]}
            series={[{ data: counts }]}
            width={500}
            height={300}
        />
    );
};