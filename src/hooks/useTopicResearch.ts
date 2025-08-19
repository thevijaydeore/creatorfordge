
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import type { TopicResearch } from '@/types/research'

interface ResearchParams {
  topicId: string
  userId: string
  depthLevel: 'quick' | 'detailed' | 'comprehensive'
}

export const useTopicResearch = () => {
  const queryClient = useQueryClient()

  const conductResearch = useMutation({
    mutationFn: async ({ topicId, userId, depthLevel }: ResearchParams) => {
      console.log('Starting topic research:', { topicId, depthLevel })
      
      const { data, error } = await supabase.functions.invoke('topic-research', {
        body: {
          topic_id: topicId,
          user_id: userId,
          depth_level: depthLevel
        }
      })

      if (error) {
        console.error('Research error:', error)
        throw new Error(error.message || 'Failed to conduct research')
      }

      return data
    },
    onSuccess: (data) => {
      const message = data.cached ? 'Research retrieved from cache' : 'Research completed successfully'
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['topic-research'] })
    },
    onError: (error) => {
      console.error('Research mutation error:', error)
      toast.error(`Research failed: ${error.message}`)
    }
  })

  return {
    conductResearch: conductResearch.mutate,
    isResearching: conductResearch.isPending,
    researchError: conductResearch.error
  }
}

export const useTopicResearchData = (topicId: string, enabled = false) => {
  return useQuery({
    queryKey: ['topic-research', topicId],
    queryFn: async (): Promise<TopicResearch | null> => {
      const { data, error } = await supabase
        .from('topic_research')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      // Transform the Json types to proper objects
      return {
        ...data,
        key_stats: typeof data.key_stats === 'string' 
          ? JSON.parse(data.key_stats) 
          : (data.key_stats as Record<string, any>),
        audience_insights: typeof data.audience_insights === 'string'
          ? JSON.parse(data.audience_insights)
          : (data.audience_insights as Record<string, any>),
        competitor_analysis: typeof data.competitor_analysis === 'string'
          ? JSON.parse(data.competitor_analysis)
          : (data.competitor_analysis as Record<string, any>),
        sources: typeof data.sources === 'string'
          ? JSON.parse(data.sources)
          : (data.sources as Array<{ url: string; credibility: string }>)
      } as TopicResearch
    },
    enabled: !!topicId && enabled
  })
}
