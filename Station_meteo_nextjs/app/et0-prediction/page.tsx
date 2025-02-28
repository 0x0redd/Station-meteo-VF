import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { ET0Prediction } from "@/components/et0/et0-prediction";

export default function ET0PredictionPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <PageHeader 
          title="ET₀ Prediction" 
          description="Evapotranspiration predictions for the next 24 hours"
        />
        <ET0Prediction />
      </div>
    </Shell>
  );
}