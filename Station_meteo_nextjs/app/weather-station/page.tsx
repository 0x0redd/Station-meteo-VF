import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { WeatherStation } from "@/components/weather/weather-station";

export default function WeatherStationPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <PageHeader 
          title="Weather Station" 
          description="Real-time weather data from your monitoring station"
        />
        <WeatherStation />
      </div>
    </Shell>
  );
}