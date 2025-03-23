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
        <WeatherStation />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <WeatherForecast />
          </div>
          <div className="w-full md:w-1/2">
            <SatelliteImagery />
          </div>
        </div>
      </div>
    </Shell>
  );
}