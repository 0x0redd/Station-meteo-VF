"use client";

import { WeatherCard } from "./weather-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Thermometer, Wind } from "lucide-react";
import { useEffect, useState } from "react";

export function WeatherStation() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch("http://localhost:8080/getAllWeatherStations");
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        // Get the last item in the array
        if (data.length > 0) {
          const stationData = data[data.length - 1]; // Get the last item
          // Map the fields to the expected properties
          setWeatherData({
            temperature: stationData.temp_moy,
            humidity: stationData.hum_moy,
            windSpeed: 0, // Placeholder, update if you have wind data
            windDirection: 0, // Placeholder, update if you have wind data
            solarRadiation: stationData.solar_radiation_moy,
            rainfall: 0, // Placeholder, update if you have rainfall data
            condition: "partlyCloudy", // Placeholder, update based on your logic
            timestamp: stationData.date,
          });
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData(); // Initial fetch

    const intervalId = setInterval(fetchWeatherData, 60000); // Fetch every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/weather-updates");

    socket.onmessage = (event) => {
      const updatedData = JSON.parse(event.data);
      setWeatherData(updatedData);
    };

    return () => {
      socket.close(); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading weather data: {error.message}</p>
      ) : weatherData ? (
        <WeatherCard 
          data={weatherData} 
          isLoading={false} 
          error={undefined} 
        />
      ) : (
        <p>No weather data available</p>
      )}
      
      {weatherData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weatherData.temperature !== undefined ? (
                <div className="text-3xl font-bold">{weatherData.temperature.toFixed(1)}°C</div>
              ) : (
                <div className="text-3xl font-bold">N/A</div>
              )}
              <div className="text-xs text-muted-foreground">
                {weatherData.temperature > 25 
                  ? "Above average for today" 
                  : weatherData.temperature < 15 
                    ? "Below average for today" 
                    : "Average for today"}
              </div>
              <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (weatherData.temperature / 40) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {weatherData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weatherData.humidity !== undefined ? (
                <div className="text-3xl font-bold">{weatherData.humidity}%</div>
              ) : (
                <div className="text-3xl font-bold">N/A</div>
              )}
              <div className="text-xs text-muted-foreground">
                {weatherData.humidity > 70 
                  ? "High humidity" 
                  : weatherData.humidity < 30 
                    ? "Low humidity" 
                    : "Moderate humidity"}
              </div>
              <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${weatherData.humidity}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {weatherData && (
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wind</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-end gap-2">
                {weatherData.windSpeed !== undefined ? (
                  <div className="text-3xl font-bold">{weatherData.windSpeed}</div>
                ) : (
                  <div className="text-3xl font-bold">N/A</div>
                )}
                <div className="text-xl mb-1">km/h</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Direction: {weatherData.windDirection}° 
                {weatherData.windDirection >= 337.5 || weatherData.windDirection < 22.5 
                  ? " (N)" 
                  : weatherData.windDirection >= 22.5 && weatherData.windDirection < 67.5 
                    ? " (NE)" 
                    : weatherData.windDirection >= 67.5 && weatherData.windDirection < 112.5 
                      ? " (E)" 
                      : weatherData.windDirection >= 112.5 && weatherData.windDirection < 157.5 
                        ? " (SE)" 
                        : weatherData.windDirection >= 157.5 && weatherData.windDirection < 202.5 
                          ? " (S)" 
                          : weatherData.windDirection >= 202.5 && weatherData.windDirection < 247.5 
                            ? " (SW)" 
                            : weatherData.windDirection >= 247.5 && weatherData.windDirection < 292.5 
                              ? " (W)" 
                              : " (NW)"}
              </div>
              <div className="relative h-24 w-24 mx-auto mt-4">
                <div className="absolute inset-0 rounded-full border-2 border-border" />
                <div 
                  className="absolute w-1 h-12 bg-primary rounded-full top-0 left-1/2 -translate-x-1/2 origin-bottom transform transition-transform duration-500"
                  style={{ transform: `translateX(-50%) rotate(${weatherData.windDirection}deg)` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}