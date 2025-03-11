"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ET0Summary } from "@/lib/api/types";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ET0SummaryCardProps {
  data?: ET0Summary;
  isLoading: boolean;
  error?: Error;
}

const staticET0Summary: ET0Summary = {
  dailyAverage: 0.35,
  trend: "increasing",
  comparisonToYesterday: 5.2
};

export function ET0SummaryCard({ data = staticET0Summary, isLoading = false, error }: ET0SummaryCardProps) {
  const [latestET0, setLatestET0] = useState<any>(null);

  useEffect(() => {
    const fetchLatestET0 = async () => {
      try {
        const response = await fetch("http://localhost:8080/getET0prediction");
        if (!response.ok) {
          throw new Error("Failed to fetch ET₀ predictions");
        }
        const predictions = await response.json();
        if (predictions.length > 0) {
          setLatestET0(predictions[predictions.length - 1]); // Get the last prediction
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLatestET0();
  }, []);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ET₀ Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-destructive">Error loading ET₀ summary</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ET₀ Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading ET₀ summary...</p>
          </div>
        ) : latestET0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Latest ET₀ Prediction</p>
                <p className="text-3xl font-bold">{latestET0.predictedET0.toFixed(2)} mm/day</p>
                <p className="text-xs text-muted-foreground">
                  Updated at: {new Date(latestET0.date).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Daily Average</p>
              <p className="text-3xl font-bold">{data.dailyAverage.toFixed(2)} mm</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        data.trend === "increasing" 
                          ? "bg-green-500" 
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.abs(data.comparisonToYesterday))}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {data.trend === "increasing" 
                      ? "Increasing compared to yesterday" 
                      : "Decreasing compared to yesterday"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {data.trend === "increasing" ? (
                  <>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                    <span className="text-green-500 font-medium">+{data.comparisonToYesterday.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-8 w-8 text-red-500" />
                    <span className="text-red-500 font-medium">-{Math.abs(data.comparisonToYesterday).toFixed(1)}%</span>
                  </>
                )}
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm">
                <span className="font-medium">Recommendation:</span>{" "}
                {data.dailyAverage > 0.4 
                  ? "Consider increasing irrigation to compensate for high evapotranspiration." 
                  : data.dailyAverage < 0.2 
                    ? "Reduce irrigation as evapotranspiration is low." 
                    : "Maintain normal irrigation schedule."}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px]">
            <p className="text-muted-foreground">No ET₀ summary available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}