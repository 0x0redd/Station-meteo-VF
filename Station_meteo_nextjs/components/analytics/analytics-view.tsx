"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, PieChart } from "../../components/ui/chart";
import { useEffect, useState } from "react";
import { fetchWeatherAnalytics } from "../../lib/api/weather-api";

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
          <LineChart data={data.temperatureTrends} xField="time" yField="temperature" />
        </CardContent>
      </Card>

      {/* Humidity Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Humidity Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={data.humidityLevels} xField="time" yField="humidity" />
        </CardContent>
      </Card>

      {/* Wind Speed Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Wind Speed Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={data.windSpeedDistribution} valueField="speed" nameField="category" />
        </CardContent>
      </Card>
    </div>
  );
}
