import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { AnalyticsView } from "@/components/analytics/analytics-view";

export default function AnalyticsPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <PageHeader 
          title="Analytics" 
          description="Advanced analytics and visualizations for weather data"
        />
        <AnalyticsView />
      </div>
    </Shell>
  );
}