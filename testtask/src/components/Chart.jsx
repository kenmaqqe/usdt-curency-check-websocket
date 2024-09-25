import React, { useState, useEffect } from "react";
import '../App.css'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const Chart = () => {
  const [chartData, setChartData] = useState([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["ChartData"],
    queryFn: () =>
      axios
        .get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
        .then((res) => res.data),
    refetchInterval: 10000,
  });
  console.log(data);

  useEffect(() => {
    if (data) {
      setChartData((prevData) => [
        ...prevData,
        { time: new Date().toLocaleTimeString(), price: parseFloat(data.price) },
      ]);
    }
  }, [data]);
  return (
    <div className='container'>
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="time" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={true} />
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
};

export default Chart;
