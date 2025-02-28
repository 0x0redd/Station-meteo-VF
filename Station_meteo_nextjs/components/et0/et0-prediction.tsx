"use client";

import { ET0SummaryCard } from "./et0-summary-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Loader2 } from "lucide-react";
import { ET0Chart } from "./et0-chart";

const staticET0Summary = {
  dailyAverage: 0.35,
  trend: "increasing" as "increasing" | "decreasing" | "stable",
  comparisonToYesterday: 5.2
};

const staticET0Predictions = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
  value: 1.32446 + Math.random() * (4.23637 - 1.32446),
  confidenceLow: 1.32446 + Math.random() * (4.23637 - 1.32446) * 0.8,
  confidenceHigh: 1.32446 + Math.random() * (4.23637 - 1.32446) * 1.2
}));

export function ET0Prediction() {
  const isSummaryLoading = false;
  const summaryError = null;
  const summaryData = { data: staticET0Summary };

  const isPredictionsLoading = false;
  const predictionsError = null;
  const predictionsData = { data: staticET0Predictions };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ET0SummaryCard 
        data={summaryData.data} 
        isLoading={isSummaryLoading} 
        error={summaryError as unknown as Error} 
      />
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Irrigation Recommendation</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? (
              <div className="flex items-center justify-center h-[100px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : summaryData.data ? (
              <div className="space-y-4">
                <div className="text-lg font-medium">
                  {summaryData.data.dailyAverage > 0.4 
                    ? "High ET₀ - Increase Irrigation" 
                    : summaryData.data.dailyAverage < 0.2 
                      ? "Low ET₀ - Reduce Irrigation" 
                      : "Normal ET₀ - Standard Irrigation"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on the current ET₀ rate of {summaryData.data.dailyAverage.toFixed(2)} mm/day
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (summaryData.data.dailyAverage / 0.6) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {Math.round((summaryData.data.dailyAverage / 0.6) * 100)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
      <ET0Chart 
        data={predictionsData.data} 
        isLoading={isPredictionsLoading} 
        error={predictionsError as unknown as Error} 
      />
    </div>
  );
}