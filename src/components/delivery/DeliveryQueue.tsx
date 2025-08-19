
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

interface QueueItem {
  id: string;
  title: string;
  platform: string;
  contentType: string;
  scheduledFor: Date;
  status: 'queued' | 'processing' | 'sent' | 'failed' | 'paused' | 'cancelled';
  progress?: number;
  retryCount?: number;
  errorMessage?: string;
  estimatedSendTime?: Date;
}

export function DeliveryQueue() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock queue data
  const [queueItems] = useState<QueueItem[]>([
    {
      id: "1",
      title: "Weekly Tech Insights",
      platform: "linkedin",
      contentType: "text_post",
      scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      status: "queued",
      estimatedSendTime: new Date(Date.now() + 30 * 60 * 1000)
    },
    {
      id: "2", 
      title: "Industry Update Thread",
      platform: "twitter",
      contentType: "thread",
      scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      status: "processing",
      progress: 65
    },
    {
      id: "3",
      title: "Product Launch Announcement",
      platform: "instagram", 
      contentType: "image_post",
      scheduledFor: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      status: "sent"
    },
    {
      id: "4",
      title: "Market Analysis Post",
      platform: "linkedin",
      contentType: "article", 
      scheduledFor: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: "failed",
      retryCount: 2,
      errorMessage: "Rate limit exceeded. Will retry in 10 minutes."
    }
  ]);

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'queued': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'processing': return <Play className="h-4 w-4 text-blue-500" />;
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: QueueItem['status']) => {
    const variants = {
      'queued': 'secondary',
      'processing': 'default',
      'sent': 'default',
      'failed': 'destructive',
      'paused': 'secondary',
      'cancelled': 'secondary'
    };
    return variants[status] as any;
  };

  const getPlatformBadge = (platform: string) => {
    const colors = {
      linkedin: "bg-blue-100 text-blue-800",
      twitter: "bg-sky-100 text-sky-800", 
      instagram: "bg-pink-100 text-pink-800",
      facebook: "bg-indigo-100 text-indigo-800"
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
      queued: queueItems.filter(i => i.status === 'queued').length,
      processing: queueItems.filter(i => i.status === 'processing').length,
      sent: queueItems.filter(i => i.status === 'sent').length,
      failed: queueItems.filter(i => i.status === 'failed').length
    };
  };

  const counts = getTabCounts();

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
            <TabsTrigger value="queued">Queued ({counts.queued})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({counts.processing})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({counts.sent})</TabsTrigger>
            <TabsTrigger value="failed">Failed ({counts.failed})</TabsTrigger>
          </TabsList>

          {(['all', 'queued', 'processing', 'sent', 'failed'] as const).map(tabValue => (
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
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge className={getPlatformBadge(item.platform)}>
                            {item.platform}
                          </Badge>
                          <Badge variant="outline">{item.contentType}</Badge>
                          <Badge variant={getStatusBadge(item.status)}>
                            {item.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            Scheduled: {format(item.scheduledFor, "MMM dd, HH:mm")} 
                            ({formatDistanceToNow(item.scheduledFor, { addSuffix: true })})
                          </p>
                          
                          {item.estimatedSendTime && item.status === 'queued' && (
                            <p>
                              Est. send time: {format(item.estimatedSendTime, "HH:mm")}
                            </p>
                          )}
                          
                          {item.retryCount && item.retryCount > 0 && (
                            <p>Retry attempts: {item.retryCount}</p>
                          )}
                          
                          {item.errorMessage && (
                            <p className="text-red-600">{item.errorMessage}</p>
                          )}
                        </div>

                        {item.status === 'processing' && item.progress && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Processing...</span>
                              <span>{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {(item.status === 'queued' || item.status === 'failed') && (
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {item.status === 'failed' && (
                        <Button variant="ghost" size="sm" title="Retry">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {(item.status === 'queued' || item.status === 'paused') && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title={item.status === 'queued' ? 'Pause' : 'Resume'}
                        >
                          {item.status === 'queued' ? 
                            <Pause className="h-4 w-4" /> : 
                            <Play className="h-4 w-4" />
                          }
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm" title="Cancel" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
