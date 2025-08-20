
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useDeliveryQueue, useDeliveryScheduler } from "@/hooks/useDeliveryScheduler";
import { useAuth } from "@/hooks/useAuth";

export function DeliveryQueue() {
  const { user } = useAuth();
  const { data: queueItems = [], isLoading } = useDeliveryQueue(user?.id || '');
  const { cancelScheduledDelivery } = useDeliveryScheduler();
  const [activeTab, setActiveTab] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'processing': return <Play className="h-4 w-4 text-blue-500" />;
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'scheduled': 'secondary',
      'processing': 'default',
      'sent': 'default',
      'failed': 'destructive',
      'cancelled': 'secondary'
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const getPlatformBadge = (platform: string) => {
    const colors = {
      linkedin: "bg-blue-100 text-blue-800",
      twitter: "bg-sky-100 text-sky-800", 
      instagram: "bg-pink-100 text-pink-800",
      facebook: "bg-indigo-100 text-indigo-800",
      youtube: "bg-red-100 text-red-800",
      tiktok: "bg-black text-white"
    };
    return colors[platform as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filterItems = (status?: string) => {
    if (!status || status === 'all') return queueItems;
    return queueItems.filter(item => item.status === status);
  };

  const getTabCounts = () => {
    return {
      all: queueItems.length,
      scheduled: queueItems.filter(i => i.status === 'scheduled').length,
      processing: queueItems.filter(i => i.status === 'processing').length,
      sent: queueItems.filter(i => i.status === 'sent').length,
      failed: queueItems.filter(i => i.status === 'failed').length
    };
  };

  const counts = getTabCounts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Queue</CardTitle>
          <CardDescription>Loading your delivery queue...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Queue</CardTitle>
        <CardDescription>
          Monitor and manage your content delivery pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({counts.scheduled})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({counts.processing})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({counts.sent})</TabsTrigger>
            <TabsTrigger value="failed">Failed ({counts.failed})</TabsTrigger>
          </TabsList>

          {(['all', 'scheduled', 'processing', 'sent', 'failed'] as const).map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              <div className="space-y-4">
                {filterItems(tabValue === 'all' ? undefined : tabValue).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(item.status)}
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">
                            {item.drafts?.title || `${item.content_type} for ${item.platform}`}
                          </h4>
                          <Badge className={getPlatformBadge(item.platform)}>
                            {item.platform}
                          </Badge>
                          <Badge variant="outline">{item.content_type}</Badge>
                          <Badge variant={getStatusBadge(item.status) as any}>
                            {item.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            Scheduled: {format(new Date(item.scheduled_for), "MMM dd, HH:mm")} 
                            ({formatDistanceToNow(new Date(item.scheduled_for), { addSuffix: true })})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {(item.status === 'scheduled' || item.status === 'failed') && (
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {item.status === 'failed' && (
                        <Button variant="ghost" size="sm" title="Retry">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {item.status === 'scheduled' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Cancel"
                          className="text-destructive"
                          onClick={() => cancelScheduledDelivery(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {filterItems(tabValue === 'all' ? undefined : tabValue).length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No {tabValue === 'all' ? '' : tabValue} items in the queue
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
