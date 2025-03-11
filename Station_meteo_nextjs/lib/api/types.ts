// Weather Station Types
export interface WeatherData {
  temperature: number;
  humidity: number;
  solarRadiation: number;
  windSpeed: number;
  windDirection: number;
  rainfall: number;
  timestamp: string;
  condition: WeatherCondition;
}

export type WeatherCondition = 
  | 'sunny'
  | 'partlyCloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy';

// ET₀ Prediction Types
export interface ET0Prediction {
  [x: string]: string | number | Date;
  timestamp: string;
  value: number;
  confidenceLow: number;
  confidenceHigh: number;
}

export interface ET0Summary {
  dailyAverage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  comparisonToYesterday: number; // percentage
}

// Historical Data Types
export interface HistoricalDataPoint {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  solarRadiation: number;
  windSpeed: number;
  windDirection: number;
  rainfall: number;
  et0: number;
}

export interface HistoricalDataFilter {
  startDate: Date;
  endDate: Date;
  aggregation: 'hourly' | 'daily' | 'weekly';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}