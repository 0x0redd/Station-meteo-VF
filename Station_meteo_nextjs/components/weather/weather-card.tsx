"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudSnow, 
  CloudSun, 
  Loader2, 
  Sun 
} from "lucide-react";
import { format } from "date-fns";

interface WeatherCardProps {
  data?: WeatherData;
  isLoading: boolean;
  error?: Error;
  className?: string;
}

export function WeatherCard({ data, isLoading, error, className }: WeatherCardProps) {
  const getWeatherIcon = (condition?: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-12 w-12 text-yellow-500 animate-pulse" />;
      case "partlyCloudy":
        return <CloudSun className="h-12 w-12 text-blue-400" />;
      case "cloudy":
        return <Cloud className="h-12 w-12 text-gray-400" />;
      case "rainy":
        return <CloudDrizzle className="h-12 w-12 text-blue-500" />;
      case "stormy":
        return <CloudLightning className="h-12 w-12 text-purple-500" />;
      case "snowy":
        return <CloudSnow className="h-12 w-12 text-blue-200" />;
      case "foggy":
        return <CloudFog className="h-12 w-12 text-gray-300" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-500" />;
    }
  };

  if (error) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle>Weather Station</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-destructive">Error loading weather data</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle>Weather Station</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading weather data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle>Weather Station</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No weather data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Current Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(data.condition)}
              <div>
                <p className="text-3xl font-bold">{data.temperature?.toFixed(1) || "N/A"}°C</p>
                <p className="text-muted-foreground capitalize">
                  {data.condition?.replace(/([A-Z])/g, ' $1').trim() || "Unknown Condition"}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-lg font-medium">{data.humidity || "N/A"}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solar Radiation</p>
              <p className="text-lg font-medium">{data.solarRadiation || "N/A"} W/m²</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wind</p>
              <p className="text-lg font-medium">{data.windSpeed || "N/A"} km/h</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rainfall</p>
              <p className="text-lg font-medium">{data.rainfall || "N/A"} mm</p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Last updated: {data.timestamp ? format(new Date(data.timestamp), "MMM d, yyyy HH:mm") : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}