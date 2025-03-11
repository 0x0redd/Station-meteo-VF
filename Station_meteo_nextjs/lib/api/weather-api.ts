"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  ApiResponse, 
  ET0Prediction, 
  ET0Summary, 
  HistoricalDataFilter, 
  HistoricalDataPoint, 
  PaginatedResponse, 
  WeatherData 
} from "./types";

// API error handling
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Fetch helper with error handling and retry logic
async function fetchWithErrorHandling<T>(
  url: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error", 0);
  }
}

// Weather Station API
export function useCurrentWeather() {
  return useQuery<ApiResponse<WeatherData>>({
    queryKey: ["currentWeather"],
    queryFn: () => 
      fetchWithErrorHandling<ApiResponse<WeatherData>>(
        `/api/weather`
      ),
    // Mock data for development
    placeholderData: {
      success: true,
      data: {
        temperature: 22.5,
        humidity: 65,
        solarRadiation: 750,
        windSpeed: 12,
        windDirection: 180,
        rainfall: 0,
        timestamp: new Date().toISOString(),
        condition: "partlyCloudy"
      }
    }
  });
}

// ET₀ Prediction API
export function useET0Predictions() {
  return useQuery<ApiResponse<ET0Prediction[]>>({
    queryKey: ["et0Predictions"],
    queryFn: () => 
      fetchWithErrorHandling<ApiResponse<ET0Prediction[]>>(
        `/api/et0`
      ),
    // Mock data for development
    placeholderData: {
      success: true,
      data: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
        value: 0.2 + Math.random() * 0.3,
        confidenceLow: 0.15 + Math.random() * 0.2,
        confidenceHigh: 0.3 + Math.random() * 0.4
      }))
    }
  });
}

export function useET0Summary() {
  return useQuery<ApiResponse<ET0Summary>>({
    queryKey: ["et0Summary"],
    queryFn: () => 
      fetchWithErrorHandling<ApiResponse<ET0Summary>>(
        `/api/et0`
      ),
    // Mock data for development
    placeholderData: {
      success: true,
      data: {
        dailyAverage: 0.35,
        trend: "increasing",
        comparisonToYesterday: 5.2
      }
    }
  });
}

// Historical Data API
export function useHistoricalData(
  filter: HistoricalDataFilter,
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery<ApiResponse<PaginatedResponse<HistoricalDataPoint>>>({
    queryKey: ["historicalData", filter, page, pageSize],
    queryFn: () => 
      fetchWithErrorHandling<ApiResponse<PaginatedResponse<HistoricalDataPoint>>>(
        `/api/historical?startDate=${filter.startDate.toISOString()}&endDate=${filter.endDate.toISOString()}&aggregation=${filter.aggregation}&page=${page}&pageSize=${pageSize}`
      ),
    // Mock data for development
    placeholderData: {
      success: true,
      data: {
        data: Array.from({ length: pageSize }, (_, i) => ({
          id: `data-${i}`,
          timestamp: new Date(filter.startDate.getTime() + i * 60 * 60 * 1000).toISOString(),
          temperature: 15 + Math.random() * 15,
          humidity: 40 + Math.random() * 50,
          solarRadiation: 200 + Math.random() * 800,
          windSpeed: Math.random() * 20,
          windDirection: Math.random() * 360,
          rainfall: Math.random() < 0.2 ? Math.random() * 5 : 0,
          et0: 0.1 + Math.random() * 0.5
        })),
        total: 100,
        page,
        pageSize,
        totalPages: Math.ceil(100 / pageSize)
      }
    }
  });
}

export function useExportHistoricalData(filter: HistoricalDataFilter, format: 'csv' | 'pdf') {
  return useQuery<ApiResponse<string>>({
    queryKey: ["exportHistoricalData", filter, format],
    queryFn: () => 
      fetchWithErrorHandling<ApiResponse<string>>(
        `/api/historical/export?startDate=${filter.startDate.toISOString()}&endDate=${filter.endDate.toISOString()}&aggregation=${filter.aggregation}&format=${format}`
      ),
    enabled: false, // Only run when explicitly requested
    // Mock data for development
    placeholderData: {
      success: true,
      data: "https://example.com/download/weather-data.csv"
    }
  });
}

// Add this function to fetch all weather stations
export function useAllWeatherStations() {
  return useQuery({
    queryKey: ['weatherStations'],
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost:8080/getAllWeatherStations');
        if (!response.ok) {
          throw new Error('Failed to fetch weather stations');
        }
        const data = await response.json();
        return { data };
      } catch (error) {
        console.error('Error fetching weather stations:', error);
        throw error;
      }
    }
  });
}