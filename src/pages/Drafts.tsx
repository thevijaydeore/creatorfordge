import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { DraftCard } from "@/components/drafts/DraftCard";
import { DraftFilters } from "@/components/drafts/DraftFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Draft {
  id: string;
  user_id: string;
  platform: string;
  content_type: string;
  title?: string;
  content: any;
  metadata: any;
  status: string;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
}

export default function Drafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Fetch drafts from Supabase
  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch drafts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate draft counts
  const draftCounts = useMemo(() => {
    return {
      linkedin: drafts.filter(d => d.platform === 'linkedin').length,
      instagram: drafts.filter(d => d.platform === 'instagram').length,
      total: drafts.length
    };
  }, [drafts]);

  // Filter drafts based on current filter states
  const filteredDrafts = useMemo(() => {
    let filtered = [...drafts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(draft => 
        draft.content.text?.toLowerCase().includes(query) ||
        draft.title?.toLowerCase().includes(query) ||
        draft.content.hashtags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(draft => draft.platform === selectedPlatform);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(draft => draft.status === selectedStatus);
    }

    // Content type filter
    if (selectedContentType !== 'all') {
      filtered = filtered.filter(draft => draft.content_type === selectedContentType);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(draft => 
        new Date(draft.created_at) >= filterDate
      );
    }

    return filtered;
  }, [drafts, searchQuery, selectedPlatform, selectedStatus, selectedContentType, dateRange]);

  const handleEdit = (draft: Draft) => {
    toast({
      title: "Edit Draft",
      description: "Draft editing functionality coming soon!",
    });
  };

  const handleSchedule = (draft: Draft) => {
    toast({
      title: "Schedule Draft",
      description: "Draft scheduling functionality coming soon!",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDrafts(prev => prev.filter(d => d.id !== id));
      toast({
        title: "Success",
        description: "Draft deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Error",
        description: "Failed to delete draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (draft: Draft) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to duplicate drafts.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('drafts')
        .insert([{
          user_id: user.id,
          platform: draft.platform,
          content_type: draft.content_type,
          title: draft.title ? `${draft.title} (Copy)` : undefined,
          content: draft.content,
          metadata: draft.metadata,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      setDrafts(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Draft duplicated successfully.",
      });
    } catch (error) {
      console.error('Error duplicating draft:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedStatus('all');
    setSelectedContentType('all');
    setDateRange('all');
  };

  const createSampleDraft = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create drafts.",
          variant: "destructive",
        });
        return;
      }

      const sampleContent = {
        text: "🚀 Excited to share my latest insights on AI and automation in the creator economy. The future of content creation is here, and it's more accessible than ever!\n\nKey takeaways:\n✨ AI tools are empowering creators, not replacing them\n📈 Automation saves time for strategic thinking\n🎯 Personalization at scale is now possible\n\nWhat's your experience with AI tools in your creative process? Let's discuss in the comments! 👇",
        hashtags: ["AI", "CreatorEconomy", "Automation", "ContentCreation", "Innovation"],
        mentions: []
      };

      const sampleDraft = {
        user_id: user.id,
        platform: "linkedin",
        content_type: "text_post",
        title: "AI in Creator Economy",
        content: sampleContent,
        metadata: {
          predicted_performance: {
            likes: 245,
            comments: 32,
            shares: 18
          },
          ai_suggestions: [
            "Add a call-to-action for engagement",
            "Consider adding relevant industry statistics",
            "Include a question to spark discussion"
          ]
        },
        status: "draft"
      };

      const { data, error } = await supabase
        .from('drafts')
        .insert([sampleDraft])
        .select()
        .single();

      if (error) throw error;

      setDrafts(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Sample draft created successfully!",
      });
    } catch (error) {
      console.error('Error creating sample draft:', error);
      toast({
        title: "Error",
        description: "Failed to create sample draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Drafts</h1>
          <p className="text-muted-foreground">
            Manage your content drafts across all platforms
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button onClick={createSampleDraft}>
            <Plus className="h-4 w-4 mr-2" />
            Create Draft
          </Button>
        </div>
      </div>

      {/* Filters */}
      <DraftFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedContentType={selectedContentType}
        onContentTypeChange={setSelectedContentType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        draftCounts={draftCounts}
        onClearFilters={clearFilters}
      />

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDrafts.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No drafts found</h3>
            <p className="text-muted-foreground mb-4">
              {drafts.length === 0 
                ? "Get started by creating your first draft"
                : "Try adjusting your filters to find what you're looking for"
              }
            </p>
            <Button onClick={createSampleDraft}>
              <Plus className="h-4 w-4 mr-2" />
              Create Sample Draft
            </Button>
          </div>
        ) : (
          // Drafts grid/list
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl'
          }`}>
            {filteredDrafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onEdit={handleEdit}
                onSchedule={handleSchedule}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}