import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Link, Upload, Trash2, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { ContentSample } from '@/types/onboarding';

const platformColors = {
  twitter: 'bg-[#1DA1F2]',
  linkedin: 'bg-[#0077B5]',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  youtube: 'bg-[#FF0000]',
  tiktok: 'bg-black',
  threads: 'bg-black',
};

export function PlatformConnectionStep() {
  const { 
    profileData, 
    contentSamples, 
    addContentSample, 
    removeContentSample, 
    nextStep, 
    prevStep, 
    isLoading 
  } = useOnboardingStore();
  
  const [activeTab, setActiveTab] = useState(profileData.platforms[0] || 'twitter');
  const [newSample, setNewSample] = useState({ content: '', url: '' });

  const handleAddSample = () => {
    if (!newSample.content.trim()) return;
    
    const sample: ContentSample = {
      id: Date.now().toString(),
      platform: activeTab,
      content: newSample.content,
      url: newSample.url || undefined,
      engagementMetrics: {
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        views: Math.floor(Math.random() * 10000),
      },
    };
    
    addContentSample(sample);
    setNewSample({ content: '', url: '' });
  };

  const getSamplesForPlatform = (platform: string) => 
    contentSamples.filter(sample => sample.platform === platform);

  const getMinSamplesForPlatform = (platform: string) => {
    const samples = getSamplesForPlatform(platform);
    return samples.length >= 3;
  };

  const allPlatformsReady = profileData.platforms.every(getMinSamplesForPlatform);

  const handleContinue = () => {
    if (allPlatformsReady) {
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Connect your best content</h2>
        <p className="text-gray-400">
          Share 3+ high-performing posts from each platform to train your AI voice
        </p>
      </div>

      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {profileData.platforms.map((platform) => {
          const samplesCount = getSamplesForPlatform(platform);
          const isComplete = samplesCount.length >= 3;
          const isActive = activeTab === platform;
          
          return (
            <Button
              key={platform}
              variant={isActive ? "default" : "outline"}
              onClick={() => setActiveTab(platform)}
              className={`relative ${isActive ? 'bg-cyan-600 hover:bg-cyan-700' : ''}`}
            >
              <span className="capitalize">{platform}</span>
              {isComplete && (
                <CheckCircle className="w-4 h-4 ml-2 text-emerald-400" />
              )}
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs"
              >
                {samplesCount.length}/3
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Content Samples for Active Platform */}
      <Card className="bg-gray-900/60 backdrop-blur-xl border-gray-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="capitalize">
                {activeTab} Content Samples
              </CardTitle>
              <CardDescription>
                Add your best-performing content to train your AI writing style
              </CardDescription>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              getMinSamplesForPlatform(activeTab) ? 'bg-emerald-400' : 'bg-yellow-400'
            }`} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Samples */}
          {getSamplesForPlatform(activeTab).map((sample) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/50 rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {sample.content}
                  </p>
                  {sample.url && (
                    <a 
                      href={sample.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-xs hover:underline flex items-center mt-2"
                    >
                      <Link className="w-3 h-3 mr-1" />
                      View original post
                    </a>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeContentSample(sample.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {sample.engagementMetrics && (
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>❤️ {sample.engagementMetrics.likes}</span>
                  <span>💬 {sample.engagementMetrics.comments}</span>
                  <span>🔄 {sample.engagementMetrics.shares}</span>
                  {sample.engagementMetrics.views && (
                    <span>👁️ {sample.engagementMetrics.views}</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}

          {/* Add New Sample Form */}
          <Card className="bg-gray-800/30 border-gray-700 border-dashed">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your high-performing content here..."
                  value={newSample.content}
                  onChange={(e) => setNewSample(prev => ({ ...prev, content: e.target.value }))}
                  className="bg-gray-800/50 border-gray-700 min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="url">URL (optional)</Label>
                <Input
                  id="url"
                  placeholder="https://..."
                  value={newSample.url}
                  onChange={(e) => setNewSample(prev => ({ ...prev, url: e.target.value }))}
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
              
              <Button
                onClick={handleAddSample}
                disabled={!newSample.content.trim()}
                className="w-full"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Content Sample
              </Button>
            </CardContent>
          </Card>

          {/* Upload Alternative */}
          <Card className="bg-gray-800/30 border-gray-700 border-dashed">
            <CardContent className="p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-400 mb-3">
                Or upload a CSV file with your content data
              </p>
              <Button variant="outline" size="sm">
                Upload CSV
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="bg-gray-900/60 backdrop-blur-xl border-gray-800/30">
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {profileData.platforms.map((platform) => {
              const samples = getSamplesForPlatform(platform);
              const isComplete = samples.length >= 3;
              
              return (
                <div key={platform} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
                      platformColors[platform as keyof typeof platformColors] || 'bg-gray-600'
                    }`}>
                      <span className="text-white text-xs font-bold capitalize">
                        {platform.charAt(0)}
                      </span>
                    </div>
                    <span className="capitalize font-medium">{platform}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={isComplete ? "default" : "secondary"}>
                      {samples.length}/3 samples
                    </Badge>
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!allPlatformsReady || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Continue to Voice Training'}
        </Button>
      </div>
    </motion.div>
  );
}
