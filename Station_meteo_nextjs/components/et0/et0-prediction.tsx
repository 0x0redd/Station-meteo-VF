"use client";

import { ET0SummaryCard } from "./et0-summary-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Loader2 } from "lucide-react";
import { ET0Chart } from "./et0-chart";
import { useEffect, useState } from "react";

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

// Update the interface to match the API response
interface ET0PredictionData {
  id: number;
  date: string;
  avgTemp: number;
  avgHumidity: number;
  avgSolarRadiation: number;
  predictedET0: number;
}

export function ET0Prediction() {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<Error | null>(null);

  const [predictionsData, setPredictionsData] = useState<ET0PredictionData[]>([]);
  const [isPredictionsLoading, setIsPredictionsLoading] = useState(true);
  const [predictionsError, setPredictionsError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      // Fetch summary data logic here
      // For now, using static data
      setSummaryData(staticET0Summary);
      setIsSummaryLoading(false);
    };

    const fetchPredictionsData = async () => {
      try {
        const response = await fetch("http://localhost:8080/getET0prediction");
        if (!response.ok) {
          throw new Error("Failed to fetch ET₀ predictions");
        }
        const predictions = await response.json();
        console.log("Fetched predictions:", predictions); // Debug log
        
        if (predictions && Array.isArray(predictions) && predictions.length > 0) {
          setPredictionsData(predictions);
        } else if (predictions && !Array.isArray(predictions)) {
          // If the API returns a single object, wrap it in an array
          setPredictionsData([predictions]);
        } else {
          console.log("Using static predictions data as fallback");
          // Convert static data to match the API format
          const formattedStaticData = staticET0Predictions.map((item, index) => ({
            id: index,
            date: item.timestamp,
            avgTemp: 20 + Math.random() * 5,
            avgHumidity: 40 + Math.random() * 30,
            avgSolarRadiation: 100 + Math.random() * 200,
            predictedET0: item.value
          }));
          setPredictionsData(formattedStaticData);
        }
      } catch (err) {
        console.error("Error fetching predictions:", err);
        setPredictionsError(err as Error);
        // Fallback to static data with the correct format
        const formattedStaticData = staticET0Predictions.map((item, index) => ({
          id: index,
          date: item.timestamp,
          avgTemp: 20 + Math.random() * 5,
          avgHumidity: 40 + Math.random() * 30,
          avgSolarRadiation: 100 + Math.random() * 200,
          predictedET0: item.value
        }));
        setPredictionsData(formattedStaticData);
      } finally {
        setIsPredictionsLoading(false);
      }
    };

    fetchSummaryData();
    fetchPredictionsData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ET0SummaryCard 
        data={summaryData} 
        isLoading={isSummaryLoading} 
        error={summaryError || undefined} 
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
            ) : summaryData ? (
              <div className="space-y-4">
                <div className="text-lg font-medium">
                  {summaryData.dailyAverage > 0.4 
                    ? "High ET₀ - Increase Irrigation" 
                    : summaryData.dailyAverage < 0.2 
                      ? "Low ET₀ - Reduce Irrigation" 
                      : "Normal ET₀ - Standard Irrigation"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on the current ET₀ rate of {summaryData.dailyAverage.toFixed(2)} mm/day
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (summaryData.dailyAverage / 0.6) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {Math.round((summaryData.dailyAverage / 0.6) * 100)}%
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
        data={predictionsData }
        isLoading={isPredictionsLoading} 
        error={predictionsError || undefined} 
      />
    </div>
  );
}