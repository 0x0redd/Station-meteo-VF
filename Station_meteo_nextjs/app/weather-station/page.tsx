import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { WeatherStation } from "@/components/weather/weather-station";
import { WeatherForecast } from "@/components/weather/weather-forecast";
import { SatelliteImagery } from "@/components/weather/satellite-imagery";

export default function WeatherStationPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <PageHeader 
          title="Weather Station" 
          description="Real-time weather data from your monitoring station"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <WeatherForecast />
          <SatelliteImagery />
        </div>
        {/* Current Weather Section */}
        <WeatherStation />
        
        {/* Forecast and Satellite Section */}
        
      </div>
    </Shell>
  );
}