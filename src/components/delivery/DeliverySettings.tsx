import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, RefreshCw, CheckCircle, Save } from "lucide-react";

export function DeliverySettings() {
  const [autoDelivery, setAutoDelivery] = useState(true);
  const [approvalWorkflow, setApprovalWorkflow] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState("3");
  const [retryInterval, setRetryInterval] = useState("30");

  return (
    <div className="space-y-6">
      {/* Auto-Delivery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Delivery Automation
          </CardTitle>
          <CardDescription>
            Configure automatic content delivery settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-delivery" className="text-base font-medium">
                Auto-Delivery
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically send content based on your schedule
              </p>
            </div>
            <Switch
              id="auto-delivery"
              checked={autoDelivery}
              onCheckedChange={setAutoDelivery}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="approval-workflow" className="text-base font-medium">
                Draft Approval Workflow
              </Label>
              <p className="text-sm text-muted-foreground">
                Require manual approval before sending drafts
              </p>
            </div>
            <Switch
              id="approval-workflow"
              checked={approvalWorkflow}
              onCheckedChange={setApprovalWorkflow}
            />
          </div>

          {approvalWorkflow && (
            <div className="ml-4 p-4 bg-muted/30 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                When enabled, all scheduled deliveries will be held for manual approval. 
                You'll receive notifications when drafts are ready for review.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about delivery events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts for delivery confirmations and failures
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-base font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive browser push notifications for real-time updates
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          {(emailNotifications || pushNotifications) && (
            <div className="space-y-3 ml-4 p-4 bg-muted/30 rounded-lg border">
              <Label className="text-sm font-medium">Notify me about:</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-creator-emerald" />
                  <span className="text-sm">Successful deliveries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Failed deliveries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-creator-orange" />
                  <span className="text-sm">Pending approvals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-creator-violet" />
                  <span className="text-sm">Schedule changes</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Retry Logic Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Retry Logic
          </CardTitle>
          <CardDescription>
            Configure how failed deliveries should be retried
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retry-attempts">Maximum Retry Attempts</Label>
              <Select value={retryAttempts} onValueChange={setRetryAttempts}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 attempt</SelectItem>
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                  <SelectItem value="10">10 attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retry-interval">Retry Interval (minutes)</Label>
              <Select value={retryInterval} onValueChange={setRetryInterval}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">
                Example
              </Badge>
              <div className="space-y-1">
                <p className="text-sm font-medium">Retry Strategy Preview</p>
                <p className="text-xs text-muted-foreground">
                  Failed deliveries will be retried up to {retryAttempts} times, 
                  with a {retryInterval}-minute interval between attempts. 
                  After all retries are exhausted, you'll be notified of the permanent failure.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Limits</CardTitle>
          <CardDescription>
            Configure rate limits to comply with provider restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email-limit">Email Rate Limit (per hour)</Label>
              <Input 
                id="email-limit" 
                type="number" 
                defaultValue="1000"
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp-limit">WhatsApp Rate Limit (per hour)</Label>
              <Input 
                id="whatsapp-limit" 
                type="number" 
                defaultValue="100"
                placeholder="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-creator-gradient hover:bg-creator-gradient-secondary">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}