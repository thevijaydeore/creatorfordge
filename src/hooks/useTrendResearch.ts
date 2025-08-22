
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { TrendResearch } from '@/types/trend-research'

interface TriggerTrendResearchParams {
  title: string
  categories?: string[]
}

export const useTrendResearch = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const triggerResearch = useMutation({
    mutationFn: async ({ title, categories = [] }: TriggerTrendResearchParams) => {
      if (!user) throw new Error('User not authenticated')

      console.log('Triggering trend research:', { title, categories })
      
      const { data, error } = await supabase.functions.invoke('trigger-trend-research', {
        body: { title, categories }
      })

      if (error) {
        console.error('Trigger research error:', error)
        throw new Error(error.message || 'Failed to trigger trend research')
      }

      return data
    },
    onSuccess: (data) => {
      toast.success('Trend research started successfully!')
      queryClient.invalidateQueries({ queryKey: ['trend-research'] })
    },
    onError: (error) => {
      console.error('Trigger research mutation error:', error)
      toast.error(`Failed to start research: ${error.message}`)
    }
  })

  return {
    triggerResearch: triggerResearch.mutate,
    isTriggering: triggerResearch.isPending,
    triggerError: triggerResearch.error
  }
}

export const useTrendResearchList = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['trend-research'],
    queryFn: async (): Promise<TrendResearch[]> => {
      if (!user) return []

      const { data, error } = await supabase
        .from('trend_research')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false })

      if (error) throw error
      
      // Type cast the research_data from Json to Record<string, any>
      return (data || []).map(item => ({
        ...item,
        research_data: item.research_data as Record<string, any>
      }))
    },
    enabled: !!user
  })
}

export const useRealtimeTrendResearch = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Set up realtime subscription for trend research updates
  if (user) {
    supabase
      .channel('trend_research_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trend_research',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Trend research realtime update:', payload)
          queryClient.invalidateQueries({ queryKey: ['trend-research'] })
          
          // Show toast for status changes
          if (payload.eventType === 'UPDATE' && payload.new) {
            const newData = payload.new as TrendResearch
            if (newData.status === 'completed') {
              toast.success(`Trend research completed: ${newData.title}`)
            } else if (newData.status === 'failed') {
              toast.error(`Trend research failed: ${newData.title}`)
            }
          }
        }
      )
      .subscribe()
  }
}
