import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TimePicker } from "@/components/delivery/TimePicker";
import { WeeklyScheduleGrid } from "@/components/delivery/WeeklyScheduleGrid";
import { TimeSlotSelector } from "@/components/delivery/TimeSlotSelector";
import { Clock, Globe, Save } from "lucide-react";

export function DeliveryScheduling() {
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [schedules, setSchedules] = useState<Record<string, string[]>>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time Configuration */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Configuration
            </CardTitle>
            <CardDescription>
              Set up your preferred delivery times and timezone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timezone Selection */}
            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Timezone
              </Label>
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Quick Time Slots */}
            <div className="space-y-3">
              <Label>Quick Time Slots</Label>
              <TimeSlotSelector />
            </div>

            <Separator />

            {/* Custom Time Picker */}
            <div className="space-y-3">
              <Label>Custom Time</Label>
              <TimePicker />
            </div>
          </CardContent>
        </Card>

        {/* Current Schedule Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
            <CardDescription>
              Overview of your current delivery schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Days</span>
                <Badge variant="secondary">5 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Deliveries</span>
                <Badge variant="secondary">3 times</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Timezone</span>
                <Badge variant="outline">{selectedTimezone}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next Delivery</span>
                <Badge className="bg-creator-gradient">Today 9:00 AM</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            Configure delivery times for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyScheduleGrid 
            schedules={schedules} 
            onSchedulesChange={setSchedules}
            timezone={selectedTimezone}
          />
          
          <div className="mt-6 flex justify-end">
            <Button className="bg-creator-gradient hover:bg-creator-gradient-secondary">
              <Save className="h-4 w-4 mr-2" />
              Save Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}