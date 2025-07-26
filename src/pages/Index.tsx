import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CreatorSidebar } from "@/components/creator/sidebar";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { MetricCard } from "@/components/creator/metric-card";
import { ContentPipeline } from "@/components/creator/content-pipeline";
import { PlatformCards } from "@/components/creator/platform-cards";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Zap, 
  Sparkles, 
  Target 
} from 'lucide-react';
import heroImage from '@/assets/creator-hero.jpg';

const Index = () => {
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      <AnimatedBackground />
      <div className="min-h-screen flex w-full">
        <CreatorSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold creator-text-gradient">Good morning, Alex!</h1>
                  <p className="text-muted-foreground">Ready to create something amazing today?</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="glass-button px-4 py-2 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Studio
                </button>
                <button className="bg-creator-gradient px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground hover-lift">
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Generate
                </button>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0">
                <img 
                  src={heroImage} 
                  alt="CreatorPulse Dashboard" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60" />
              </div>
              <div className="relative p-8 lg:p-12">
                <div className="max-w-2xl">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                    Your Daily <span className="creator-text-gradient">Pulse</span> is Ready
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    3 trending drafts generated, 2 pending reviews, and insights from 12 sources analyzed.
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="bg-creator-gradient px-6 py-3 rounded-lg font-medium text-primary-foreground hover-lift">
                      Review Drafts
                    </button>
                    <button 
                      onClick={() => navigate('/onboarding')}
                      className="glass-button px-6 py-3 font-medium"
                    >
                      Try Onboarding
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Draft Acceptance"
                value="87%"
                change="+12%"
                changeType="positive"
                icon={Target}
                gradient
              />
              <MetricCard
                title="Avg Review Time"
                value="8 min"
                change="-3 min"
                changeType="positive"
                icon={TrendingUp}
              />
              <MetricCard
                title="Total Followers"
                value="21.4K"
                change="+1.2K"
                changeType="positive"
                icon={Users}
              />
              <MetricCard
                title="Weekly Impressions"
                value="156K"
                change="+23%"
                changeType="positive"
                icon={Eye}
              />
            </div>

            {/* Platform Cards */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-card-foreground">Connected Platforms</h3>
              <PlatformCards />
            </div>

            {/* Content Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContentPipeline />
              
              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-6 text-card-foreground">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="glass-button p-4 text-left space-y-2 hover-lift">
                    <Sparkles className="w-6 h-6 text-creator-violet" />
                    <p className="font-medium text-sm">Generate Thread</p>
                    <p className="text-xs text-muted-foreground">Create Twitter thread from trending topic</p>
                  </button>
                  <button className="glass-button p-4 text-left space-y-2 hover-lift">
                    <TrendingUp className="w-6 h-6 text-creator-cyan" />
                    <p className="font-medium text-sm">Trend Analysis</p>
                    <p className="text-xs text-muted-foreground">Analyze current trending topics</p>
                  </button>
                  <button className="glass-button p-4 text-left space-y-2 hover-lift">
                    <Users className="w-6 h-6 text-creator-emerald" />
                    <p className="font-medium text-sm">Audience Insights</p>
                    <p className="text-xs text-muted-foreground">View detailed audience analytics</p>
                  </button>
                  <button className="glass-button p-4 text-left space-y-2 hover-lift">
                    <Zap className="w-6 h-6 text-creator-orange" />
                    <p className="font-medium text-sm">Pulse Schedule</p>
                    <p className="text-xs text-muted-foreground">Configure daily delivery settings</p>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">AI Insights & Recommendations</h3>
                <span className="glass-button px-3 py-1 text-xs font-medium">Powered by GPT-4</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-creator-emerald rounded-full"></div>
                    <span className="text-sm font-medium text-creator-emerald">Trending Up</span>
                  </div>
                  <h4 className="font-semibold text-card-foreground">AI Content Creation Tools</h4>
                  <p className="text-sm text-muted-foreground">
                    25% increase in engagement mentions. Consider creating a comprehensive guide or thread.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-creator-violet rounded-full"></div>
                    <span className="text-sm font-medium text-creator-violet">Optimization</span>
                  </div>
                  <h4 className="font-semibold text-card-foreground">Best Posting Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Your audience is most active Tuesday-Thursday, 9-11 AM EST. Schedule accordingly.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-creator-cyan rounded-full"></div>
                    <span className="text-sm font-medium text-creator-cyan">Voice Match</span>
                  </div>
                  <h4 className="font-semibold text-card-foreground">Voice Training Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    87% voice similarity achieved. Review 3 more drafts to reach 90%+ accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;