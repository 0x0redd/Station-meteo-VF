import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { HistoricalDataView } from "@/components/historical/historical-data-view";

export default function HistoricalDataPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <PageHeader 
          title="Historical Data" 
          description="Access and analyze historical weather and ET₀ data"
        />
        <HistoricalDataView />
      </div>
    </Shell>
  );
}