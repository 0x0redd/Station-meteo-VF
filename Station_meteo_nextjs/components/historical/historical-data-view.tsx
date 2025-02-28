"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useHistoricalData, useExportHistoricalData } from "@/lib/api/weather-api";
import { HistoricalDataFilter } from "@/lib/api/types";
import { DateRangePicker } from "./date-range-picker";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoricalDataChart } from "./historical-data-chart";
import { Download, Loader2 } from "lucide-react";

export function HistoricalDataView() {
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Aggregation state
  const [aggregation, setAggregation] = useState<"hourly" | "daily" | "weekly">("daily");

  // Create filter object
  const filter: HistoricalDataFilter = {
    startDate: dateRange?.from || subDays(new Date(), 7),
    endDate: dateRange?.to || new Date(),
    aggregation,
  };

  // Fetch historical data
  const { 
    data: historicalData, 
    isLoading, 
    error 
  } = useHistoricalData(filter, pageIndex + 1, pageSize);

  // Export functionality
  const { 
    data: exportData, 
    isLoading: isExporting, 
    refetch: refetchExportData // Renamed to avoid conflict
  } = useExportHistoricalData(filter, "csv");

  // Handle export
  const handleExport = async (format: "csv" | "pdf") => {
    const { data } = await refetchExportData(); // Updated to use the renamed variable
    if (data?.data) {
      window.open(data.data, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <DateRangePicker 
                dateRange={dateRange} 
                onDateRangeChange={setDateRange} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aggregation</label>
              <Select 
                value={aggregation} 
                onValueChange={(value) => setAggregation(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select aggregation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Data</label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleExport("csv")}
                  disabled={isExporting}
                  className="flex-1"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                  className="flex-1"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="table">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="chart">Chart View</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-destructive">Error loading historical data</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={historicalData?.data.data || []}
              pageCount={historicalData?.data.totalPages || 0}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageChange={setPageIndex}
              onPageSizeChange={setPageSize}
            />
          )}
        </TabsContent>
        <TabsContent value="chart" className="mt-4">
          <HistoricalDataChart 
            data={historicalData?.data.data || []} 
            isLoading={isLoading} 
            error={error as Error} 
            aggregation={aggregation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}