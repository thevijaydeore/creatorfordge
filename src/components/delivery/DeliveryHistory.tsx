import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Eye, Mail, MessageCircle, CheckCircle, XCircle, Clock } from "lucide-react";

export function DeliveryHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  // Mock data
  const deliveries = [
    {
      id: "del_001",
      date: "2024-01-15",
      time: "09:00",
      channel: "email",
      status: "delivered",
      recipients: 1247,
      opened: 856,
      clicked: 234,
      contentPreview: "AI automation in content creation - Today's trending topic...",
    },
    {
      id: "del_002",
      date: "2024-01-15",
      time: "14:00",
      channel: "email",
      status: "delivered",
      recipients: 1247,
      opened: 743,
      clicked: 189,
      contentPreview: "Social media engagement strategies - Best practices for...",
    },
    {
      id: "del_003",
      date: "2024-01-14",
      time: "18:00",
      channel: "whatsapp",
      status: "failed",
      recipients: 0,
      opened: 0,
      clicked: 0,
      contentPreview: "Creator economy trends - How the landscape is changing...",
      error: "API authentication failed"
    },
    {
      id: "del_004",
      date: "2024-01-14",
      time: "09:00",
      channel: "email",
      status: "delivered",
      recipients: 1245,
      opened: 892,
      clicked: 267,
      contentPreview: "Content creation tools review - Top 10 tools every...",
    },
    {
      id: "del_005",
      date: "2024-01-13",
      time: "14:00",
      channel: "email",
      status: "pending",
      recipients: 1250,
      opened: 0,
      clicked: 0,
      contentPreview: "Weekend content planning - Strategies for scheduling...",
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4 text-creator-emerald" />;
      case "failed": return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending": return <Clock className="h-4 w-4 text-creator-orange" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      delivered: "default",
      failed: "destructive", 
      pending: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email": return <Mail className="h-4 w-4" />;
      case "whatsapp": return <MessageCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.contentPreview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    const matchesChannel = channelFilter === "all" || delivery.channel === channelFilter;
    return matchesSearch && matchesStatus && matchesChannel;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
          <CardDescription>
            View and analyze your past content deliveries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deliveries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{delivery.date}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {delivery.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getChannelIcon(delivery.channel)}
                      <span className="capitalize">{delivery.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(delivery.status)}
                      {getStatusBadge(delivery.status)}
                    </div>
                    {delivery.error && (
                      <div className="text-xs text-destructive mt-1">
                        {delivery.error}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {delivery.recipients.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {delivery.status === "delivered" && (
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-creator-violet font-medium">
                            {delivery.opened}
                          </span>
                          <span className="text-muted-foreground"> opened</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-creator-emerald font-medium">
                            {delivery.clicked}
                          </span>
                          <span className="text-muted-foreground"> clicked</span>
                        </div>
                      </div>
                    )}
                    {delivery.status !== "delivered" && (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-sm truncate" title={delivery.contentPreview}>
                        {delivery.contentPreview}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-creator-cyan">12</div>
            <div className="text-sm text-muted-foreground">Total Deliveries</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-creator-emerald">98.5%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-creator-violet">3,847</div>
            <div className="text-sm text-muted-foreground">Total Opens</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-creator-orange">924</div>
            <div className="text-sm text-muted-foreground">Total Clicks</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}