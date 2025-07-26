import React from 'react';
import { ExternalLink, Users, TrendingUp, Calendar } from 'lucide-react';

interface PlatformData {
  name: string;
  connected: boolean;
  followers: string;
  engagement: string;
  nextPost: string;
  color: string;
}

const platforms: PlatformData[] = [
  {
    name: 'Twitter',
    connected: true,
    followers: '12.5K',
    engagement: '4.2%',
    nextPost: 'In 2 hours',
    color: 'from-blue-400 to-blue-600'
  },
  {
    name: 'LinkedIn',
    connected: true,
    followers: '8.9K',
    engagement: '6.8%',
    nextPost: 'Tomorrow 9 AM',
    color: 'from-blue-600 to-blue-800'
  },
  {
    name: 'Instagram',
    connected: false,
    followers: '0',
    engagement: '0%',
    nextPost: 'Not connected',
    color: 'from-pink-400 to-purple-600'
  }
];

export const PlatformCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {platforms.map((platform) => (
        <div key={platform.name} className="glass-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                <span className="text-white font-semibold text-sm">{platform.name[0]}</span>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{platform.name}</h3>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${platform.connected ? 'bg-creator-emerald' : 'bg-muted-foreground'}`} />
                  <span className="text-xs text-muted-foreground">
                    {platform.connected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-card-foreground transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {platform.connected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Followers</span>
                </div>
                <span className="font-semibold text-card-foreground">{platform.followers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>Engagement</span>
                </div>
                <span className="font-semibold text-creator-emerald">{platform.engagement}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Next Post</span>
                </div>
                <span className="text-sm text-card-foreground">{platform.nextPost}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">Connect your account to start creating content</p>
              <button className="glass-button px-4 py-2 text-sm font-medium text-primary">
                Connect {platform.name}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};