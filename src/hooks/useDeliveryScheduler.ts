
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface ScheduleDeliveryParams {
  userId: string
  platform: string
  contentType: string
  scheduledFor: string
  draftId?: string
  autoGenerate?: boolean
  customPrompt?: string
  recurringConfig?: {
    frequency: 'weekly' | 'daily'
    weeklySchedules?: Record<string, string[]>
  }
}

interface DeliverySchedule {
  id: string
  user_id: string
  platform: string
  content_type: string
  scheduled_for: string
  status: 'scheduled' | 'processing' | 'sent' | 'failed' | 'cancelled'
  draft_id?: string
  auto_generate: boolean
  custom_prompt?: string
  recurring_config?: any
  created_at: string
  updated_at: string
}

export const useDeliveryScheduler = () => {
  const queryClient = useQueryClient()

  const scheduleDelivery = useMutation({
    mutationFn: async (params: ScheduleDeliveryParams) => {
      console.log('Scheduling delivery:', params)
      
      const { data, error } = await supabase
        .from('delivery_schedules')
        .insert({
          user_id: params.userId,
          platform: params.platform,
          content_type: params.contentType,
          scheduled_for: params.scheduledFor,
          draft_id: params.draftId,
          auto_generate: params.autoGenerate || false,
          custom_prompt: params.customPrompt,
          recurring_config: params.recurringConfig,
          status: 'scheduled'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Delivery scheduled successfully')
      queryClient.invalidateQueries({ queryKey: ['delivery-schedules'] })
      queryClient.invalidateQueries({ queryKey: ['delivery-queue'] })
    },
    onError: (error) => {
      console.error('Scheduling error:', error)
      toast.error(`Failed to schedule delivery: ${error.message}`)
    }
  })

  const cancelScheduledDelivery = useMutation({
    mutationFn: async (scheduleId: string) => {
      const { data, error } = await supabase
        .from('delivery_schedules')
        .update({ status: 'cancelled' })
        .eq('id', scheduleId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Delivery cancelled')
      queryClient.invalidateQueries({ queryKey: ['delivery-schedules'] })
      queryClient.invalidateQueries({ queryKey: ['delivery-queue'] })
    },
    onError: (error) => {
      console.error('Cancellation error:', error)
      toast.error(`Failed to cancel delivery: ${error.message}`)
    }
  })

  return {
    scheduleDelivery: scheduleDelivery.mutate,
    cancelScheduledDelivery: cancelScheduledDelivery.mutate,
    isScheduling: scheduleDelivery.isPending,
    isCancelling: cancelScheduledDelivery.isPending,
    schedulingError: scheduleDelivery.error
  }
}

export const useDeliverySchedules = (userId: string) => {
  return useQuery({
    queryKey: ['delivery-schedules', userId],
    queryFn: async (): Promise<DeliverySchedule[]> => {
      const { data, error } = await supabase
        .from('delivery_schedules')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_for', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!userId
  })
}

export const useDeliveryQueue = (userId: string) => {
  return useQuery({
    queryKey: ['delivery-queue', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_schedules')
        .select(`
          *,
          drafts(title, content)
        `)
        .eq('user_id', userId)
        .in('status', ['scheduled', 'processing'])
        .order('scheduled_for', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
    refetchInterval: 30000 // Refresh every 30 seconds
  })
}
