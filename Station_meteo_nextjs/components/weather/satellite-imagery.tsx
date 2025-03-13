"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// NASA GIBS layers (simplified selection)
const MAP_LAYERS = [
  { id: "MODIS_Terra_CorrectedReflectance_TrueColor", name: "True Color (Terra/MODIS)" },
  { id: "VIIRS_SNPP_CorrectedReflectance_TrueColor", name: "True Color (Suomi NPP/VIIRS)" },
  { id: "MODIS_Terra_Land_Surface_Temp_Day", name: "Land Surface Temperature" },
  { id: "MODIS_Terra_Cloud_Top_Temp_Day", name: "Cloud Top Temperature" },
  { id: "MODIS_Terra_Water_Vapor_5km_Day", name: "Water Vapor" },
  { id: "MODIS_Terra_Snow_Cover", name: "Snow Cover" }
];



export function SatelliteImagery() {
  const [selectedLayer, setSelectedLayer] = useState("MODIS_Terra_CorrectedReflectance_TrueColor");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 48.8566, lon: 2.3522 }); // Default to Paris
  const [date, setDate] = useState(format(subDays(new Date(), 1), "yyyy-MM-dd")); // Yesterday (NASA imagery has a ~24h delay)
  const [zoom, setZoom] = useState(6);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          console.log("Unable to retrieve your location, using default");
        }
      );
    }
  }, []);

  // When layer or date changes, simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedLayer, date]);

  const getNasaGibsUrl = () => {
    const baseUrl = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best";
    const layer = selectedLayer;
    const time = date;
    const resolution = "250m";
    const width = 800;
    const height = 400;
  
    // Adjust the bounding box size based on zoom level
    const bboxSize = 10 / zoom; // Smaller value for higher zoom
    const bbox = `${location.lon - bboxSize},${location.lat - bboxSize},${location.lon + bboxSize},${location.lat + bboxSize}`;
  
    // Direct URL to NASA GIBS
    const imageUrl = `${baseUrl}/${layer}/default/${time}/1/${zoom}/0/0.jpg?bbox=${bbox}`;
    
    // Use the proxy API to avoid CORS issues
    return `/api/proxy?url=${encodeURIComponent(imageUrl)}`;
  };
  const handleLayerChange = (value: string) => {
    setSelectedLayer(value);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Satellite Imagery</CardTitle>
        <CardDescription>
          Earth observation data from NASA GIBS
        </CardDescription>
        <div className="flex items-center gap-2">
          <Select value={selectedLayer} onValueChange={handleLayerChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select layer" />
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
                <p className="text-sm text-muted-foreground">
                  NASA imagery has approximately a 24-hour delay.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3, 4].map((daysAgo) => {
                    const dateValue = format(subDays(new Date(), daysAgo + 1), "yyyy-MM-dd");
                    return (
                      <Button 
                        key={dateValue}
                        variant={date === dateValue ? "default" : "outline"}
                        onClick={() => handleDateChange(dateValue)}
                      >
                        {format(subDays(new Date(), daysAgo + 1), "MMM dd")}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Loading satellite imagery...</p>
          </div>
        ) : (
          <div className="relative w-full h-64 bg-muted/50 rounded-lg overflow-hidden">
            <img
                src={getNasaGibsUrl()}
                alt={`${MAP_LAYERS.find(layer => layer.id === selectedLayer)?.name} satellite imagery`}
                className="w-full h-full object-cover"
              />
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2 text-center">
              <p className="text-sm">
                {MAP_LAYERS.find(layer => layer.id === selectedLayer)?.name} | {date}
              </p>
              <p className="text-xs text-muted-foreground">
                Lat: {location.lat.toFixed(2)}, Lon: {location.lon.toFixed(2)}
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">
            Data provided by NASA GIBS
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(3, zoom - 1))}>
              -
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(9, zoom + 1))}>
              +
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}