import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeliveryScheduling } from "@/components/delivery/DeliveryScheduling";
import { DeliveryChannels } from "@/components/delivery/DeliveryChannels";
import { DeliveryHistory } from "@/components/delivery/DeliveryHistory";
import { DeliverySettings } from "@/components/delivery/DeliverySettings";
import { Clock, Send, History, Settings } from "lucide-react";

export default function Delivery() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Delivery Management</h1>
          <p className="text-muted-foreground">
            Schedule and manage your content delivery across multiple channels
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="scheduling" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scheduling" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Scheduling
            </TabsTrigger>
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scheduling" className="space-y-6">
            <DeliveryScheduling />
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <DeliveryChannels />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <DeliveryHistory />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <DeliverySettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}