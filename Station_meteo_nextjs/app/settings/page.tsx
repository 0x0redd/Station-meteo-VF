import { Shell } from "@/components/layout/shell";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/settings/settings-form";

export default function SettingsPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <PageHeader 
          title="Settings" 
          description="Configure your weather dashboard preferences"
        />
        <SettingsForm />
      </div>
    </Shell>
  );
}