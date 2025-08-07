import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Camera, User, Mail, Linkedin, Crown, Upload, Save } from "lucide-react";

export function ProfileSettings() {
  const [fullName, setFullName] = useState("Alex Creator");
  const [email, setEmail] = useState("alex@example.com");
  const [linkedinConnected, setLinkedinConnected] = useState(false);

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile picture" />
                <AvatarFallback className="text-lg bg-creator-gradient text-white">
                  AC
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                variant="secondary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button className="bg-creator-gradient hover:bg-creator-gradient-secondary">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* LinkedIn Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5" />
            LinkedIn Profile
          </CardTitle>
          <CardDescription>
            Connect your LinkedIn profile to import your professional information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${linkedinConnected ? 'bg-creator-emerald/10' : 'bg-muted'}`}>
                <Linkedin className={`h-5 w-5 ${linkedinConnected ? 'text-creator-emerald' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-medium">
                  {linkedinConnected ? 'Connected to LinkedIn' : 'Not Connected'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {linkedinConnected 
                    ? 'Your LinkedIn profile is synced' 
                    : 'Connect to import your professional details'
                  }
                </p>
              </div>
            </div>
            <Button 
              variant={linkedinConnected ? "outline" : "default"}
              onClick={() => setLinkedinConnected(!linkedinConnected)}
            >
              {linkedinConnected ? 'Disconnect' : 'Connect LinkedIn'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Tier & Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Account & Usage
          </CardTitle>
          <CardDescription>
            Your current plan and usage statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-creator-gradient">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Pro Plan</span>
                  <Badge className="bg-creator-gradient">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Billing cycle: Monthly
                </p>
              </div>
            </div>
            <Button variant="outline">Manage Plan</Button>
          </div>

          <Separator />

          {/* Usage Statistics */}
          <div className="space-y-4">
            <h4 className="font-medium">Usage This Month</h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Content Generated</span>
                  <span>75 / 100</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Calls</span>
                  <span>2,340 / 5,000</span>
                </div>
                <Progress value={47} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage Used</span>
                  <span>1.2 GB / 10 GB</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}