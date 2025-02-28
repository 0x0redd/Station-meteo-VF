"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ET0Prediction } from "@/lib/api/types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface ET0ChartProps {
  data?: ET0Prediction[];
  isLoading: boolean;
  error?: Error;
}

export function ET0Chart({ data, isLoading, error }: ET0ChartProps) {
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ET₀ Predictions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[400px]">
          <p className="text-destructive">Error loading ET₀ data</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.map(item => ({
    time: format(new Date(item.timestamp), "HH:mm"),
    value: parseFloat(item.value.toFixed(2)),
    confidenceLow: parseFloat(item.confidenceLow.toFixed(2)),
    confidenceHigh: parseFloat(item.confidenceHigh.toFixed(2)),
    timestamp: item.timestamp,
  }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>ET₀ Predictions (24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading ET₀ prediction data...</p>
          </div>
        ) : chartData && chartData.length > 0 ? (
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
                    value: "ET₀ (mm/hour)", 
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
                          <p className="text-sm font-medium">{format(new Date(data.timestamp), "MMM d, HH:mm")}</p>
                          <p className="text-sm text-muted-foreground">
                            ET₀: <span className="font-medium">{data.value} mm/hour</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Confidence Interval: {data.confidenceLow} - {data.confidenceHigh}
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
                  dataKey="confidenceHigh"
                  stackId="1"
                  stroke="transparent"
                  fill="hsl(var(--chart-1) / 0.2)"
                  name="Confidence High"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stackId="2"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1) / 0.7)"
                  name="ET₀ Prediction"
                />
                <Area
                  type="monotone"
                  dataKey="confidenceLow"
                  stackId="3"
                  stroke="transparent"
                  fill="hsl(var(--chart-1) / 0.1)"
                  name="Confidence Low"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <p className="text-muted-foreground">No ET₀ prediction data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}