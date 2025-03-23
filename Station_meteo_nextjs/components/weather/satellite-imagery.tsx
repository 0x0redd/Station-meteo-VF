"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// NASA GIBS layers
const MAP_LAYERS = [
  { id: "MODIS_Terra_CorrectedReflectance_TrueColor", name: "Terra, MODIS, True Color, Corrected Reflectance" },
  { id: "MODIS_Terra_CorrectedReflectance_Bands721", name: "Terra, MODIS, 7-2-1, Corrected Reflectance" },
  { id: "MODIS_Terra_CorrectedReflectance_Bands367", name: "Terra, MODIS, 3-6-7, Corrected Reflectance" },
  { id: "MODIS_Aqua_CorrectedReflectance_TrueColor", name: "Aqua, MODIS, True Color, Corrected Reflectance" },
  { id: "MODIS_Aqua_CorrectedReflectance_Bands721", name: "Aqua, MODIS, 7-2-1, Corrected Reflectance" },
  { id: "VIIRS_SNPP_CorrectedReflectance_TrueColor", name: "Suomi NPP, VIIRS, True Color, Corrected Reflectance" },
  { id: "VIIRS_SNPP_CorrectedReflectance_BandsM11I2I1", name: "Suomi NPP, VIIRS, M11-I2-I1, Corrected Reflectance" },
  { id: "VIIRS_SNPP_CorrectedReflectance_BandsM3I3M11", name: "Suomi NPP, VIIRS, M3-I3-M11, Corrected Reflectance" },
  { id: "VIIRS_SNPP_DayNightBand_ENCC", name: "Suomi NPP, VIIRS, Day/Night Band, ENCC (Nighttime imagery)" },
];


export function SatelliteImagery() {
  const [selectedLayer, setSelectedLayer] = useState("MODIS_Terra_CorrectedReflectance_TrueColor");
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("2025-03-13"); // Match the image date
  const [imageError, setImageError] = useState(false);
  const [selectedOverlays, setSelectedOverlays] = useState([
    "MODIS_Terra_Thermal_Anomalies_Day",
    "Coastlines_15m", 
    "Reference_Features_15m"
  ]);

  // Morocco coordinates exactly as in the image
  const boundingBox = {
    south: 20.7669,
    west: -17.1046,
    north: 35.9265,
    east: -1.032
  };

  // When layer or date changes, simulate loading
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedLayer, date, selectedOverlays]);

  const getNasaGibsUrl = () => {
    // Use NASA WorldView direct image export
    const baseUrl = "https://wvs.earthdata.nasa.gov/api/v1/snapshot";
    
    // Combine base layer with selected overlays
    const layers = [selectedLayer, ...selectedOverlays].join(",");
    
    // Create params for WorldView snapshot API
    const params = new URLSearchParams({
      REQUEST: "GetSnapshot",
      LAYERS: layers,
      CRS: "EPSG:4326",
      TIME: date,
      WRAP: "DAY,DAY,X,X",
      BBOX: `${boundingBox.south},${boundingBox.west},${boundingBox.north},${boundingBox.east}`,
      FORMAT: "image/jpeg",
      WIDTH: "800",
      HEIGHT: "600",
      AUTOSCALE: "TRUE"
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleLayerChange = (value: string) => {
    setSelectedLayer(value);
  };

  interface BoundingBox {
    south: number;
    west: number;
    north: number;
    east: number;
  }

  interface Layer {
    id: string;
    name: string;
  }

  const handleDateChange = (value: string) => {
    setDate(value);
  };

  interface Overlay {
    id: string;
    name: string;
  }

  const toggleOverlay = (overlayId: string) => {
    setSelectedOverlays((prevOverlays: string[]) => {
      if (prevOverlays.includes(overlayId)) {
        return prevOverlays.filter(id => id !== overlayId);
      } else {
        return [...prevOverlays, overlayId];
      }
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Available dates for the date picker
  const availableDates = [
    "2025-03-13", // Match the image date
    "2025-03-12",
    "2025-03-11",
    "2025-03-10",
    "2025-03-09",
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Satellite Imagery</CardTitle>
        <CardDescription>
          Earth observation data from NASA GIBS
        </CardDescription>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Select value={selectedLayer} onValueChange={handleLayerChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select base layer" />
              </SelectTrigger>
              <SelectContent>
                {MAP_LAYERS.map((layer) => (
                  <SelectItem key={layer.id} value={layer.id}>
                    {layer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">{date}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-2">
                  <h4 className="font-medium">Select Date</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {availableDates.map((dateValue) => (
                      <Button 
                        key={dateValue}
                        variant={date === dateValue ? "default" : "outline"}
                        onClick={() => handleDateChange(dateValue)}
                      >
                        {format(parseISO(dateValue), "MMM dd")}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading satellite imagery...</p>
          </div>
        ) : (
          <div className="relative w-full h-full bg-muted/50 rounded-lg overflow-hidden">
            {imageError ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">
                  Unable to load satellite imagery for this date/location.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different date or layer.
                </p>
              </div>
            ) : (
              <img
                src={getNasaGibsUrl()}
                alt={`${MAP_LAYERS.find(layer => layer.id === selectedLayer)?.name} satellite imagery`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
              <p className="text-sm">
                Base Layer: {MAP_LAYERS.find(layer => layer.id === selectedLayer)?.name} | {date}
              </p>
              <div className="flex justify-between">
                <p className="text-xs text-muted-foreground">
                  Morocco Region: {boundingBox.south.toFixed(4)}°N, {boundingBox.west.toFixed(4)}°E to {boundingBox.north.toFixed(4)}°N, {boundingBox.east.toFixed(4)}°E
                </p>
                <p className="text-xs text-muted-foreground">
                  Data provided by NASA GIBS
                </p>
              </div>
            </div>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}