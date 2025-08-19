
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

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
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topic_research')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!topicId && enabled
  })
}
