"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

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
          <CardTitle>ET₀ Predictions (Last 24 Hours)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px]">
          <p className="text-destructive">Error loading ET₀ predictions</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Get the last 24 records (or all if less than 24)
  const last24Records = data.slice(-24);

  // Format data for the chart
  const chartData = last24Records.map(item => ({
    time: format(parseISO(item.date), "HH:mm"),
    date: item.date,
    et0: item.predictedET0,
    temperature: item.avgTemp,
    humidity: item.avgHumidity,
    solarRadiation: item.avgSolarRadiation
  }));

  // Setup chart with overlapping data
  const renderOverlappingChart = () => {
    if (!chartData || chartData.length === 0) return null;
    
    // Find min and max values for scaling each metric
    const tempValues = chartData.map(item => item.temperature);
    const maxTemp = Math.max(...tempValues);
    const minTemp = Math.min(...tempValues);
    const tempRange = maxTemp - minTemp;
    
    const humidityValues = chartData.map(item => item.humidity);
    const maxHumidity = Math.max(...humidityValues);
    const minHumidity = Math.min(...humidityValues);
    const humidityRange = maxHumidity - minHumidity;
    
    const et0Values = chartData.map(item => item.et0);
    const maxEt0 = Math.max(...et0Values);
    const minEt0 = Math.min(...et0Values);
    const et0Range = maxEt0 - minEt0;
    
    const buffer = 0.2; // 20% buffer
    const chartHeight = 400;
    
    // Scale functions for each metric
    const scaleTemp = (temp: number) => {
      return chartHeight - ((temp - (minTemp - tempRange * buffer)) / (tempRange * (1 + 2 * buffer)) * chartHeight);
    };
    
    const scaleHumidity = (humidity: number) => {
      return chartHeight - ((humidity - (minHumidity - humidityRange * buffer)) / (humidityRange * (1 + 2 * buffer)) * chartHeight);
    };
    
    const scaleEt0 = (et0: number) => {
      return chartHeight - ((et0 - (minEt0 - et0Range * buffer)) / (et0Range * (1 + 2 * buffer)) * chartHeight);
    };
    
    return (
      <div className="mt-4 px-2">
        <div className="relative w-full" style={{ height: `${chartHeight}px` }}>
          {/* Background grid lines */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div 
                key={`grid-${i}`}
                className="absolute border-t border-gray-200 w-full"
                style={{ top: `${i * 25}%` }}
              />
            ))}
          </div>

          {/* ET0 line */}
          <svg className="absolute top-0 left-0 w-full h-full">
            <polyline
              points={chartData.map((item, i) => {
                const x = `${(i / (chartData.length - 1)) * 100}%`;
                const y = scaleEt0(item.et0);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          </svg>
          
          {/* Temperature line */}
          <svg className="absolute top-0 left-0 w-full h-full">
            <polyline
              points={chartData.map((item, i) => {
                const x = `${(i / (chartData.length - 1)) * 100}%`;
                const y = scaleTemp(item.temperature);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </svg>
          
          {/* Humidity line */}
          <svg className="absolute top-0 left-0 w-full h-full">
            <polyline
              points={chartData.map((item, i) => {
                const x = `${(i / (chartData.length - 1)) * 100}%`;
                const y = scaleHumidity(item.humidity);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
          </svg>
          
          {/* Data points for each dataset */}
          {chartData.map((item, index) => {
            const x = `${(index / (chartData.length - 1)) * 100}%`;
            const yTemp = scaleTemp(item.temperature);
            const yHumidity = scaleHumidity(item.humidity);
            const yEt0 = scaleEt0(item.et0);
            
            // Only show labels for every 4th point to avoid overcrowding
            const showLabel = index % 4 === 0;
            
            return (
              <div key={`point-${item.date}`} className="absolute" style={{ left: x }}>
                {/* ET0 dot and label */}
                {showLabel && (
                  <div className="absolute transform -translate-x-1/2" style={{ top: yEt0 - 20 }}>
                    <span className="text-xs font-semibold text-primary">{item.et0.toFixed(2)}</span>
                  </div>
                )}
                <div className="absolute w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: 0, top: yEt0 }}>
                </div>
                
                {/* Temperature dot and label */}
                {showLabel && (
                  <div className="absolute transform -translate-x-1/2" style={{ top: yTemp - 20 }}>
                    <span className="text-xs font-semibold text-red-700">{item.temperature.toFixed(1)}°</span>
                  </div>
                )}
                <div className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: 0, top: yTemp }}>
                </div>
                
                {/* Humidity dot and label */}
                {showLabel && (
                  <div className="absolute transform -translate-x-1/2" style={{ top: yHumidity + 4 }}>
                    <span className="text-xs font-semibold text-blue-700">{item.humidity}%</span>
                  </div>
                )}
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: 0, top: yHumidity }}>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* X-axis labels (times) */}
        <div className="flex justify-between mt-2">
          {chartData.filter((_, i) => i % 4 === 0).map((item) => (
            <div key={`label-${item.date}`} className="text-xs text-center">
              {item.time}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
            <span className="text-xs">ET₀ (mm/hour)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs">Temperature (°C)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs">Humidity (%)</span>
          </div>
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute right-2 top-0 bottom-0 flex flex-col text-xs text-muted-foreground">
          <span className="text-red-600">{maxTemp.toFixed(1)}°C | {maxHumidity}% | {maxEt0.toFixed(2)}</span>
          <span className="text-blue-600">{minTemp.toFixed(1)}°C | {minHumidity}% | {minEt0.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>ET₀ and Weather Metrics (Last 24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading ET₀ predictions...</p>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <>
            <div className="h-[450px] relative">
              <p className="text-sm text-muted-foreground mb-4">
                This chart shows the relationship between ET₀, temperature and humidity over the last 24 hours
              </p>
              {renderOverlappingChart()}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <p className="text-muted-foreground">No ET₀ prediction data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}