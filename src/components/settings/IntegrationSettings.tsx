import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Linkedin, Mail, MessageCircle, Plug, CheckCircle, XCircle, Settings, Save } from "lucide-react";

export function IntegrationSettings() {
  const [linkedinConnected, setLinkedinConnected] = useState(true);
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Integration Status
          </CardTitle>
          <CardDescription>
            Overview of all your connected services and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LinkedIn Status */}
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="p-2 rounded-lg bg-blue-50">
                <Linkedin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">LinkedIn</span>
                  {linkedinConnected ? (
                    <CheckCircle className="h-4 w-4 text-creator-emerald" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {linkedinConnected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>

            {/* Email Status */}
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="p-2 rounded-lg bg-green-50">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email</span>
                  {emailConfigured ? (
                    <CheckCircle className="h-4 w-4 text-creator-emerald" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {emailConfigured ? "Configured" : "Not configured"}
                </p>
              </div>
            </div>

            {/* WhatsApp Status */}
            <div className="flex items-center gap-3 p-4 rounded-lg border">
              <div className="p-2 rounded-lg bg-green-50">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">WhatsApp</span>
                  {whatsappConnected ? (
                    <CheckCircle className="h-4 w-4 text-creator-emerald" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {whatsappConnected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Details */}
      <Tabs defaultValue="linkedin" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        {/* LinkedIn Integration */}
        <TabsContent value="linkedin">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Linkedin className="h-5 w-5" />
                LinkedIn API Integration
              </CardTitle>
              <CardDescription>
                Connect your LinkedIn account to analyze posts and engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn Professional Account</p>
                    <p className="text-sm text-muted-foreground">
                      {linkedinConnected ? "alex.creator@linkedin.com" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {linkedinConnected && (
                    <Badge className="bg-creator-emerald text-white">Connected</Badge>
                  )}
                  <Button
                    variant={linkedinConnected ? "outline" : "default"}
                    onClick={() => setLinkedinConnected(!linkedinConnected)}
                  >
                    {linkedinConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>

              {linkedinConnected && (
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2">
                    <Label>Permissions Granted</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Read Posts</Badge>
                      <Badge variant="secondary">View Analytics</Badge>
                      <Badge variant="secondary">Profile Access</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Refresh Token
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Integration */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Service Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for email delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input id="smtp-username" placeholder="your-email@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">Password</Label>
                  <Input id="smtp-password" type="password" placeholder="••••••••" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch id="smtp-ssl" />
                <Label htmlFor="smtp-ssl">Use SSL/TLS</Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Test Connection</Button>
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Integration */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Business API
              </CardTitle>
              <CardDescription>
                Connect your WhatsApp Business account for message delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-token">Access Token</Label>
                  <Input id="whatsapp-token" type="password" placeholder="Enter your WhatsApp Business API token" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number-id">Phone Number ID</Label>
                  <Input id="phone-number-id" placeholder="Enter your phone number ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verify-token">Verify Token</Label>
                  <Input id="verify-token" placeholder="Enter your verify token" />
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium mb-2">Setup Instructions:</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Create a WhatsApp Business account</li>
                  <li>2. Set up a Meta Developer account</li>
                  <li>3. Create a new app and get your API credentials</li>
                  <li>4. Add the webhook URL in your Meta app settings</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Test Connection</Button>
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}