
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export function DeliveryAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock analytics data
  const deliveryStats = {
    totalScheduled: 156,
    successfulDeliveries: 142,
    failedDeliveries: 8,
    pendingDeliveries: 6,
    successRate: 91.0,
    avgDeliveryTime: 2.3
  };

  const platformStats = [
    { platform: "LinkedIn", scheduled: 65, delivered: 62, failed: 2, pending: 1, rate: 95.4 },
    { platform: "Twitter", scheduled: 48, delivered: 44, failed: 3, pending: 1, rate: 91.7 },
    { platform: "Instagram", scheduled: 28, delivered: 24, failed: 2, pending: 2, rate: 85.7 },
    { platform: "Facebook", scheduled: 15, delivered: 12, failed: 1, pending: 2, rate: 80.0 }
  ];

  const dailyDeliveries = [
    { date: "Mon", scheduled: 22, delivered: 20, failed: 2 },
    { date: "Tue", scheduled: 18, delivered: 17, failed: 1 },
    { date: "Wed", scheduled: 25, delivered: 24, failed: 1 },
    { date: "Thu", scheduled: 20, delivered: 18, failed: 2 },
    { date: "Fri", scheduled: 28, delivered: 26, failed: 2 },
    { date: "Sat", scheduled: 15, delivered: 15, failed: 0 },
    { date: "Sun", scheduled: 12, delivered: 12, failed: 0 }
  ];

  const contentTypeStats = [
    { name: "Text Posts", value: 45, count: 72 },
    { name: "Images", value: 30, count: 48 },
    { name: "Articles", value: 15, count: 24 },
    { name: "Videos", value: 10, count: 16 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const getPlatformColor = (platform: string) => {
    const colors = {
      "LinkedIn": "bg-blue-100 text-blue-800",
      "Twitter": "bg-sky-100 text-sky-800", 
      "Instagram": "bg-pink-100 text-pink-800",
      "Facebook": "bg-indigo-100 text-indigo-800"
    };
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Delivery Analytics</h2>
          <p className="text-muted-foreground">Track your content delivery performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.totalScheduled}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.successRate}%</div>
            <Progress value={deliveryStats.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.avgDeliveryTime}m</div>
            <p className="text-xs text-muted-foreground">
              -0.5m from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Deliveries</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{deliveryStats.failedDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              -2 from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="content">Content Types</TabsTrigger>
          <TabsTrigger value="timing">Timing Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Delivery Performance</CardTitle>
              <CardDescription>Scheduled vs delivered content over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyDeliveries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scheduled" fill="#8884d8" name="Scheduled" />
                  <Bar dataKey="delivered" fill="#82ca9d" name="Delivered" />
                  <Bar dataKey="failed" fill="#ffc658" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Delivery success rates by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformStats.map((platform) => (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getPlatformColor(platform.platform)}>
                          {platform.platform}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {platform.delivered}/{platform.scheduled} delivered
                        </span>
                      </div>
                      <span className="font-medium">{platform.rate}%</span>
                    </div>
                    <Progress value={platform.rate} className="h-2" />
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {platform.delivered} delivered
                      </span>
                      {platform.failed > 0 && (
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                          {platform.failed} failed
                        </span>
                      )}
                      {platform.pending > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-yellow-500" />
                          {platform.pending} pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
                <CardDescription>Breakdown by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={contentTypeStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contentTypeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>Success rates by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentTypeStats.map((content, index) => (
                    <div key={content.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{content.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {content.count} total
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <Progress value={85 + Math.random() * 15} className="flex-1 h-2" />
                        <span className="text-sm font-medium">
                          {Math.round(85 + Math.random() * 15)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimal Delivery Times</CardTitle>
              <CardDescription>Performance analysis by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Timing analysis requires more data. Continue scheduling deliveries to see insights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
