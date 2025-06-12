
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from 'axios';

import HistogramForTalentSeeker from "./TalentSeekerRegion";

const HistogramForTalent = ({
  dataKey = "value",
  binsKey = "label",
  barColor = "#8884d8",
}) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchHistoGramdata = async () => {
      try {
        const histogramDataResponse = await axios.get("http://127.0.0.1:8000/sushtiti/account/profile/full/");
        const userProfiles = histogramDataResponse.data.doctor_profiles;
        
        // Process the data to count users by address
        const addressCounts = userProfiles.reduce((acc, user) => {
          const address = user.address || 'Unknown'; // Handle cases where address might be null/undefined
          acc[address] = (acc[address] || 0) + 1;
          return acc;
        }, {});
        
        // Convert to format needed for the chart
        const processedData = Object.entries(addressCounts).map(([address, count]) => ({
          label: address,
          value: count
        }));
        
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching histogram data:", error);
      }
    };
    fetchHistoGramdata();
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
        <h1>Talent Seeker Regions</h1>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={binsKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={barColor} />
        </BarChart>
      </ResponsiveContainer>

      <HistogramForTalentSeeker/>
    </div>
  );
};

export default HistogramForTalent;
