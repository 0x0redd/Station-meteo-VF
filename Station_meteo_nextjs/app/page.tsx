import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { WeatherStation } from "@/components/weather/weather-station";
import { ET0Prediction } from "@/components/et0/et0-prediction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CloudSun, History } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <Shell>
      <div className="space-y-6">
        <PageHeader 
          title="Weather Dashboard" 
          description="Real-time weather monitoring and ET₀ prediction dashboard"
        />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/weather-station" className="block">
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Weather Station</CardTitle>
                <CloudSun className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Real-time weather data from your station including temperature, humidity, and solar radiation.
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/et0-prediction" className="block">
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">ET₀ Prediction</CardTitle>
                <CloudSun className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  24-hour evapotranspiration predictions with confidence intervals and irrigation recommendations.
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/historical-data" className="block">
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Historical Data</CardTitle>
                <History className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Access and analyze historical weather and ET₀ data with customizable date ranges and export options.
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/analytics" className="block">
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Advanced analytics and visualizations to identify trends and patterns in your weather data.
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
            <WeatherStation />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">ET₀ Predictions</h2>
            <ET0Prediction />
          </div>
        </div>
      </div>
    </Shell>
  );
}