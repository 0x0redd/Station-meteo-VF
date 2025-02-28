"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoricalDataPoint } from "@/lib/api/types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart,
  CartesianGrid, 
  ComposedChart,
  Legend, 
  Line,
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HistoricalDataChartProps {
  data: HistoricalDataPoint[];
  isLoading: boolean;
  error?: Error;
  aggregation: "hourly" | "daily" | "weekly";
}

export function HistoricalDataChart({ 
  data, 
  isLoading, 
  error,
  aggregation 
}: HistoricalDataChartProps) {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Data Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[400px]">
          <p className="text-destructive">Error loading historical data</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (aggregation === "hourly") {
      return format(date, "HH:mm");
    } else if (aggregation === "daily") {
      return format(date, "MMM dd");
    } else {
      return format(date, "MMM dd");
    }
  };

  const chartData = data.map(item => ({
    ...item,
    time: formatDate(item.timestamp),
    timestamp: item.timestamp,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Data Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading historical data...</p>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <Tabs defaultValue="temperature">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="temperature">Temperature & Humidity</TabsTrigger>
              <TabsTrigger value="solar">Solar Radiation</TabsTrigger>
              <TabsTrigger value="wind">Wind & Rainfall</TabsTrigger>
              <TabsTrigger value="et0">ET₀</TabsTrigger>
            </TabsList>
            
            <TabsContent value="temperature" className="mt-4">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      yAxisId="left"
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      label={{ 
                        value: "Temperature (°C)", 
                        angle: -90, 
                        position: "insideLeft",
                        className: "text-xs text-muted-foreground fill-muted-foreground"
                      }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      label={{ 
                        value: "Humidity (%)", 
                        angle: 90, 
                        position: "insideRight",
                        className: "text-xs text-muted-foreground fill-muted-foreground"
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <p className="text-sm font-medium">{format(new Date(data.timestamp), "MMM d, yyyy HH:mm")}</p>
                              <p className="text-sm text-muted-foreground">
                                Temperature: <span className="font-medium">{data.temperature.toFixed(1)}°C</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Humidity: <span className="font-medium">{data.humidity}%</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Temperature"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Humidity"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="solar" className="mt-4">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      label={{ 
                        value: "Solar Radiation (W/m²)", 
                        angle: -90, 
                        position: "insideLeft",
                        className: "text-xs text-muted-foreground fill-muted-foreground"
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <p className="text-sm font-medium">{format(new Date(data.timestamp), "MMM d, yyyy HH:mm")}</p>
                              <p className="text-sm text-muted-foreground">
                                Solar Radiation: <span className="font-medium">{data.solarRadiation} W/m²</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="solarRadiation"
                      stroke="hsl(var(--chart-4))"
                      fill="hsl(var(--chart-4) / 0.5)"
                      name="Solar Radiation"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="wind" className="mt-4">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      yAxisId="left"
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      label={{ 
                        value: "Wind Speed (km/h)", 
                        angle: -90, 
                        position: "insideLeft",
                        className: "text-xs text-muted-foreground fill-muted-foreground"
                      }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      label={{ 
                        value: "Rainfall (mm)", 
                        angle: 90, 
                        position: "insideRight",
                        className: "text-xs text-muted-foreground fill-muted-foreground"
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <p className="text-sm font-medium">{format(new Date(data.timestamp), "MMM d, yyyy HH:mm")}</p>
                              <p className="text-sm text-muted-foreground">
                                Wind Speed: <span className="font-medium">{data.windSpeed} km/h</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Rainfall: <span className="font-medium">{data.rainfall} mm</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="windSpeed"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      name="Wind Speed"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="rainfall"
                      fill="hsl(var(--chart-2))"
                      name="Rainfall"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="et0" className="mt-4">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="time" 
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                    />
                    <YAxis 
                      className="text-xs text-muted-foreground"
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      label={{ 
                        value: "ET₀ (mm)", 
                        angle: -90, 
                        position: "insideLeft",
                        className: "text-xs text-muted-foreground fill-muted-foreground"
                      }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-md">
                              <p className="text-sm font-medium">{format(new Date(data.timestamp), "MMM d, yyyy HH:mm")}</p>
                              <p className="text-sm text-muted-foreground">
                                ET₀: <span className="font-medium">{data.et0.toFixed(2)} mm</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="et0"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1) / 0.5)"
                      name="ET₀"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <p className="text-muted-foreground">No historical data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}