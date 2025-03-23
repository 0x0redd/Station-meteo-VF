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
  const [location, setLocation] = useState({ lat: 35.5, lon: -1 }); // Default to Paris

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

  // Function to render the temperature chart
  const renderTemperatureChart = () => {
    if (forecast.length === 0) return null;
    
    // Find min and max values for scaling
    const allTemps = forecast.slice(0, 7).flatMap(day => [day.temperature_max, day.temperature_min]);
    const maxTemp = Math.max(...allTemps);
    const minTemp = Math.min(...allTemps);
    const range = maxTemp - minTemp;
    const buffer = range * 0.2; // Add 20% buffer for better visualization
    
    const chartHeight = 360;
    const scaleTemp = (temp: number) => {
      return chartHeight - ((temp - (minTemp - buffer)) / (range + 2 * buffer) * chartHeight);
    };
    
    return (
      <div className="mt-4 px-2">
        <div className="w-relative  ml-10 mr-10 relative" style={{ height: `${chartHeight}px` }}>
          {/* Temperature lines */}
          {forecast.slice(0, 14).map((day, index) => {
            const nextDay = forecast[index + 1];
            if (!nextDay) return null;
            
            const x1 = `${(index / 6) * 100}%`;
            const y1Max = scaleTemp(day.temperature_max);
            const x2 = `${((index + 1) / 6) * 100}%`;
            const y2Max = scaleTemp(nextDay.temperature_max);
            
            const y1Min = scaleTemp(day.temperature_min);
            const y2Min = scaleTemp(nextDay.temperature_min);
            
            return (
              <div key={`line-${day.date}`}>
                {/* Max temp line */}
                <svg className="absolute top-0 left-0 w-full h-full">
                  <line
                    x1={x1}
                    y1={y1Max}
                    x2={x2}
                    y2={y2Max}
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                </svg>
                
                {/* Min temp line */}
                <svg className="absolute top-0 left-0 w-full h-full">
                  <line
                    x1={x1}
                    y1={y1Min}
                    x2={x2}
                    y2={y2Min}
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            );
          })}
          
          {/* Temperature dots and labels */}
          {forecast.slice(0, 7).map((day, index) => {
            const x = `${(index / 6) * 100}%`;
            const yMax = scaleTemp(day.temperature_max);
            const yMin = scaleTemp(day.temperature_min);
            
            return (
              <div key={`point-${day.date}`} className="absolute" style={{ left: x }}>
                {/* Max temp dot and label */}
                <div className="absolute transform -translate-x-1/2" style={{ top: yMax - 30 }}>
                  <span className="text-xs font-semibold text-red-700">{day.temperature_max.toFixed(0)}°</span>
                </div>
                <div className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: 0, top: yMax }}>
                </div>
                
                {/* Min temp dot and label */}
                <div className="absolute transform -translate-x-1/2" style={{ top: yMin + 4 }}>
                  <span className="text-xs font-semibold text-blue-500">{day.temperature_min.toFixed(0)}°</span>
                </div>
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: 0, top: yMin }}>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* X-axis labels (days) */}
        <div className="flex justify-between mt-2">
          {forecast.slice(0, 7).map((day) => (
            <div key={`label-${day.date}`} className="text-xs text-center">
              {format(new Date(day.date), "EEE")}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs">Max Temp</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs">Min Temp</span>
          </div>
        </div>
      </div>
    );
  };

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
              {forecast.slice(0, 7).map((day) => (
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
              {forecast.slice(0, 7).map((day) => (
                <div key={day.date} className="flex flex-col items-center p-2 text-center">
                  <p className="text-xs font-medium">{format(new Date(day.date), "EEE")}</p>
                  {getWeatherInfo(day.weathercode).icon}
                  <p className="text-xs font-medium mt-1">{day.temperature_max.toFixed(0)}°</p>
                  <p className="text-xs text-muted-foreground">{day.temperature_min.toFixed(0)}°</p>
                </div>
              ))}
            </div>
            
            {/* Temperature chart */}
            {renderTemperatureChart()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}