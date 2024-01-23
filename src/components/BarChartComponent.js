// components/BarChartComponent.js
import { BarChart } from "@mui/x-charts";

export const BarChartComponent = ({ data }) => {
    const districts = data.map(item => item.district);
    const counts = data.map(item => item.count);

    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: districts }]}
            series={[{ data: counts }]}
            width={500}
            height={300}
        />
    );
};