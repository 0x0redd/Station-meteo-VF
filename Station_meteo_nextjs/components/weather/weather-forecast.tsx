"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudSnow, CloudSun, Loader2, Sun } from "lucide-react";
import { format, addDays } from "date-fns";

interface ForecastDay {
  date: string;
  temperature_max: number;
  temperature_min: number;
  weathercode: number;
  precipitation_probability_max: number;
}

interface OpenMeteoForecast {
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_probability_max: number[];
  };
}

export function WeatherForecast() {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [location, setLocation] = useState({ lat: 48.8566, lon: 2.3522 }); // Default to Paris

  // Get weather condition icon and name based on WMO code
  const getWeatherInfo = (code: number) => {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    switch (true) {
      case code === 0:
        return { icon: <Sun className="h-8 w-8 text-yellow-500" />, name: "Clear sky" };
      case code === 1:
        return { icon: <CloudSun className="h-8 w-8 text-blue-400" />, name: "Mainly clear" };
      case code === 2:
        return { icon: <CloudSun className="h-8 w-8 text-blue-400" />, name: "Partly cloudy" };
      case code === 3:
        return { icon: <Cloud className="h-8 w-8 text-gray-400" />, name: "Overcast" };
      case code <= 49:
        return { icon: <CloudFog className="h-8 w-8 text-gray-300" />, name: "Fog" };
      case code <= 59:
        return { icon: <CloudDrizzle className="h-8 w-8 text-blue-300" />, name: "Drizzle" };
      case code <= 69:
        return { icon: <CloudDrizzle className="h-8 w-8 text-blue-500" />, name: "Rain" };
      case code <= 79:
        return { icon: <CloudSnow className="h-8 w-8 text-blue-200" />, name: "Snow" };
      case code <= 99:
        return { icon: <CloudLightning className="h-8 w-8 text-purple-500" />, name: "Thunderstorm" };
      default:
        return { icon: <Cloud className="h-8 w-8 text-gray-400" />, name: "Unknown" };
    }
  };

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          console.log("Unable to retrieve your location, using default");
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        
        const data: OpenMeteoForecast = await response.json();
        
        // Map the API data to our format
        const forecastData: ForecastDay[] = data.daily.time.map((date, index) => ({
          date,
          temperature_max: data.daily.temperature_2m_max[index],
          temperature_min: data.daily.temperature_2m_min[index],
          weathercode: data.daily.weathercode[index],
          precipitation_probability_max: data.daily.precipitation_probability_max[index]
        }));
        
        setForecast(forecastData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, [location]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading forecast data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <p className="text-destructive">Error loading forecast data</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>7-Day Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="space-y-4">
            <div className="grid grid-cols-1 gap-2 mt-2">
              {forecast.slice(0, 3).map((day) => (
                <div key={day.date} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getWeatherInfo(day.weathercode).icon}
                    <div>
                      <p className="font-medium">{format(new Date(day.date), "EEE, MMM d")}</p>
                      <p className="text-xs text-muted-foreground">{getWeatherInfo(day.weathercode).name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{day.temperature_max.toFixed(1)}°C / {day.temperature_min.toFixed(1)}°C</p>
                    <p className="text-xs text-muted-foreground">Precipitation: {day.precipitation_probability_max}%</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="weekly">
            <div className="grid grid-cols-7 gap-1 mt-2">
              {forecast.map((day) => (
                <div key={day.date} className="flex flex-col items-center p-2 text-center">
                  <p className="text-xs font-medium">{format(new Date(day.date), "EEE")}</p>
                  {getWeatherInfo(day.weathercode).icon}
                  <p className="text-xs font-medium mt-1">{day.temperature_max.toFixed(0)}°</p>
                  <p className="text-xs text-muted-foreground">{day.temperature_min.toFixed(0)}°</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}