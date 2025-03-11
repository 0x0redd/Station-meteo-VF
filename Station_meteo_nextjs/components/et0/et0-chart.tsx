"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { format, parseISO } from "date-fns";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface ET0PredictionData {
  id: number;
  date: string;
  avgTemp: number;
  avgHumidity: number;
  avgSolarRadiation: number;
  predictedET0: number;
}

interface ET0ChartProps {
  data: ET0PredictionData[];
  isLoading: boolean;
  error?: Error;
}

export function ET0Chart({ data, isLoading, error }: ET0ChartProps) {
  if (error) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>ET₀ Predictions (24 Hours)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px]">
          <p className="text-destructive">Error loading ET₀ predictions</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = data.map(item => ({
    time: format(parseISO(item.date), "HH:mm"),
    date: item.date,
    value: item.predictedET0,
    temperature: item.avgTemp,
    humidity: item.avgHumidity,
    solarRadiation: item.avgSolarRadiation
  }));

  // Chart configuration
  const chartConfig = {
    et0: {
      label: "ET₀",
      color: "hsl(var(--primary))"
    },
    temperature: {
      label: "Temperature",
      color: "hsl(var(--destructive))"
    },
    humidity: {
      label: "Humidity",
      color: "hsl(var(--secondary))"
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>ET₀ Predictions (24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading ET₀ predictions...</p>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  label={{ 
                    value: "ET₀ (mm/hour)", 
                    angle: -90, 
                    position: "insideLeft",
                    style: { textAnchor: 'middle', fontSize: '12px' }
                  }}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="text-sm font-medium">{format(parseISO(data.date), "MMM d, yyyy HH:mm")}</p>
                          <p className="text-sm text-muted-foreground">
                            ET₀: <span className="font-medium">{data.value.toFixed(2)} mm/hour</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Temperature: <span className="font-medium">{data.temperature.toFixed(1)}°C</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Humidity: <span className="font-medium">{data.humidity}%</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Solar Radiation: <span className="font-medium">{data.solarRadiation.toFixed(1)} W/m²</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="et0"
                  stroke={chartConfig.et0.color}
                  fill={`${chartConfig.et0.color}50`}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No ET₀ prediction data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}