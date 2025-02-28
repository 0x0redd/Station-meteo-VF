"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from "recharts";

async function fetchWeatherAnalytics() {
  const response = await fetch("/api/weather-analytics");
  if (!response.ok) {
    throw new Error("Failed to fetch weather analytics");
  }
  const data = await response.json();
  return data;
}

export function AnalyticsView() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const analyticsData = await fetchWeatherAnalytics();
      setData(analyticsData);
    }
    loadData();
  }, []);

  if (!data) {
    return <p className="text-center text-gray-500">Loading analytics...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Temperature Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={400} height={300} data={data.map(d => ({ time: d.date, temperature: d.temp_moy }))}>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>

      {/* Humidity Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Humidity Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={400} height={300} data={data.map(d => ({ time: d.date, humidity: d.hum_moy }))}>
            <XAxis dataKey="time" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Bar dataKey="humidity" fill="#82ca9d" />
          </BarChart>
        </CardContent>
      </Card>

      {/* Wind Speed Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Wind Speed Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={400} height={300}>
            <Pie data={data.map((d: { date: any; windSpeed: any; }) => ({ category: d.date, speed: d.windSpeed }))} dataKey="speed" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
}

