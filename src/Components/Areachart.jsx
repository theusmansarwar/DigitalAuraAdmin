import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchDashboardChart } from "../DAL/fetch";


const Areachart = () => {
  const [chartData, setChartData] = useState([]);

  const getImpressionsData = async () => {
    try {
      const response = await fetchDashboardChart();
      if (response?.last30DaysData) {
        // Formatting date for the X-Axis
        const formattedData = response.last30DaysData.map((item) => ({
          day: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          }), // Converts date to "Mar 09" format
          Impressions: item.views,
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching impressions data:", error);
    }
  };

  useEffect(() => {
    getImpressionsData();
  }, []);

  return (
    <div className="chart-area" style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="Impressions" stroke="#004ab8" fill="var(--background-color)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Areachart;
