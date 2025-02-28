"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function SettingsForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // General settings
  const [stationName, setStationName] = useState("Main Weather Station");
  const [refreshInterval, setRefreshInterval] = useState("5");
  const [darkMode, setDarkMode] = useState(true);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [emailAddress, setEmailAddress] = useState("user@example.com");
  const [alertThresholds, setAlertThresholds] = useState({
    temperature: "30",
    rainfall: "10",
    windSpeed: "20",
  });
  
  // API settings
  const [apiKey, setApiKey] = useState("sk_test_12345abcdef");
  const [apiEndpoint, setApiEndpoint] = useState("https://api.weatherdashboard.example");

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure general dashboard settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="station-name">Weather Station Name</Label>
              <Input
                id="station-name"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refresh-interval">Data Refresh Interval (minutes)</Label>
              <Select
                value={refreshInterval}
                onValueChange={setRefreshInterval}
              >
                <SelectTrigger id="refresh-interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Label htmlFor="dark-mode">Use dark mode by default</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how and when you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
              <Label htmlFor="email-notifications">Enable email notifications</Label>
            </div>
            {emailNotifications && (
              <div className="space-y-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Alert Thresholds</Label>
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-4">
                  <Label htmlFor="temperature-threshold" className="self-center">Temperature (°C)</Label>
                  <Input
                    id="temperature-threshold"
                    value={alertThresholds.temperature}
                    onChange={(e) => setAlertThresholds({...alertThresholds, temperature: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Label htmlFor="rainfall-threshold" className="self-center">Rainfall (mm)</Label>
                  <Input
                    id="rainfall-threshold"
                    value={alertThresholds.rainfall}
                    onChange={(e) => setAlertThresholds({...alertThresholds, rainfall: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Label htmlFor="wind-threshold" className="self-center">Wind Speed (km/h)</Label>
                  <Input
                    id="wind-threshold"
                    value={alertThresholds.windSpeed}
                    onChange={(e) => setAlertThresholds({...alertThresholds, windSpeed: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>
              Configure API connection settings for data retrieval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input
                id="api-endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-version">API Version</Label>
              <Select defaultValue="v1">
                <SelectTrigger id="api-version">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">Version 1.0</SelectItem>
                  <SelectItem value="v2">Version 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Test Connection</Button>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}