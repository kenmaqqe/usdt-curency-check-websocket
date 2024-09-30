import React, { useState, useEffect } from "react";
import "../App.css";
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

  // Запит через React Query для отримання початкових даних
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ["ChartData"],
    queryFn: () =>
      axios
        .get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
        .then((res) => res.data),
  });

  // Ефект для підключення до WebSocket
  useEffect(() => {
    // Додаємо початкові дані до графіка
    if (initialData) {
      setChartData((prevData) => [
        ...prevData,
        { time: new Date().toLocaleTimeString(), price: parseFloat(initialData.price) },
      ]);
    }

    // Створюємо WebSocket-з'єднання
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    // Обробка даних з WebSocket
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const newPrice = parseFloat(message.p);

      // Оновлюємо дані графіка з новими даними
      setChartData((prevData) => [
        ...prevData,
        { time: new Date().toLocaleTimeString(), price: newPrice },
      ]);
    };

    // Закриваємо з'єднання при розмонтаженні компонента
    return () => {
      socket.close();
    };
  }, [initialData]); // Запускається після завантаження початкових даних

  // Виведення стану завантаження та помилок
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
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
