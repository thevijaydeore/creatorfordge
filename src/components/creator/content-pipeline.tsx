import React from 'react';
import { Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface PipelineItem {
  id: string;
  title: string;
  platform: string;
  status: 'draft' | 'review' | 'scheduled' | 'published';
  time: string;
}

const mockPipeline: PipelineItem[] = [
  { id: '1', title: 'AI Revolution in Content Creation', platform: 'LinkedIn', status: 'review', time: '2 min ago' },
  { id: '2', title: 'Thread: Building in Public Tips', platform: 'Twitter', status: 'scheduled', time: '1 hour' },
  { id: '3', title: 'Creator Economy Insights Reel', platform: 'Instagram', status: 'draft', time: '3 hours ago' },
  { id: '4', title: 'Weekly Newsletter Draft', platform: 'Substack', status: 'published', time: '1 day ago' },
];

export const ContentPipeline = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <AlertCircle className="w-4 h-4 text-creator-orange" />;
      case 'review': return <Clock className="w-4 h-4 text-creator-cyan" />;
      case 'scheduled': return <Zap className="w-4 h-4 text-creator-violet" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-creator-emerald" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'draft': return `${baseClasses} bg-creator-orange/20 text-creator-orange`;
      case 'review': return `${baseClasses} bg-creator-cyan/20 text-creator-cyan`;
      case 'scheduled': return `${baseClasses} bg-creator-violet/20 text-creator-violet`;
      case 'published': return `${baseClasses} bg-creator-emerald/20 text-creator-emerald`;
      default: return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Content Pipeline</h3>
        <button className="glass-button px-4 py-2 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockPipeline.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0">
              {getStatusIcon(item.status)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{item.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-muted-foreground">{item.platform}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className={getStatusBadge(item.status)}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};