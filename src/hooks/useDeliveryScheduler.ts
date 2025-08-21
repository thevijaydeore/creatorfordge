
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

// Updated types to match the new database schema with ENUM types
export type DeliveryPlatform = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'tiktok'
export type DeliveryContentType = 'post' | 'thread' | 'story' | 'reel' | 'video' | 'carousel' | 'article'
export type DeliveryStatus = 'scheduled' | 'processing' | 'sent' | 'failed' | 'cancelled'

interface ScheduleDeliveryParams {
  userId: string
  platform: DeliveryPlatform
  contentType: DeliveryContentType
  scheduledFor: string
  draftId?: string
  autoGenerate?: boolean
  customPrompt?: string
  recurringConfig?: {
    frequency: 'weekly' | 'daily'
    weeklySchedules?: Record<string, string[]>
  }
}

interface UpdateDeliveryParams {
  scheduleId: string
  platform?: DeliveryPlatform
  contentType?: DeliveryContentType
  scheduledFor?: string
  autoGenerate?: boolean
  customPrompt?: string
  status?: DeliveryStatus
}

interface DeliverySchedule {
  id: string
  user_id: string
  platform: DeliveryPlatform
  content_type: DeliveryContentType
  scheduled_for: string
  status: DeliveryStatus
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
          status: 'scheduled' as DeliveryStatus
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
        .update({ status: 'cancelled' as DeliveryStatus })
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

  const updateScheduledDelivery = useMutation({
    mutationFn: async (params: UpdateDeliveryParams) => {
      const update: Record<string, any> = {}
      if (params.platform) update.platform = params.platform
      if (params.contentType) update.content_type = params.contentType
      if (params.scheduledFor) update.scheduled_for = params.scheduledFor
      if (typeof params.autoGenerate === 'boolean') update.auto_generate = params.autoGenerate
      if (typeof params.customPrompt !== 'undefined') update.custom_prompt = params.customPrompt
      if (params.status) update.status = params.status

      const { data, error } = await supabase
        .from('delivery_schedules')
        .update(update)
        .eq('id', params.scheduleId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Delivery updated')
      queryClient.invalidateQueries({ queryKey: ['delivery-schedules'] })
      queryClient.invalidateQueries({ queryKey: ['delivery-queue'] })
    },
    onError: (error) => {
      console.error('Update error:', error)
      toast.error(`Failed to update delivery: ${error.message}`)
    }
  })

  const runDeliveryProcessor = useMutation({
    mutationFn: async (params: { minutesAhead?: number; scheduleId?: string }) => {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      const { data, error } = await supabase.functions.invoke('process-delivery', {
        body: { minutesAhead: params.minutesAhead ?? 1, scheduleId: params.scheduleId },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      })
      if (error) throw error
      return data
    },
    onSuccess: (data: any) => {
      const processed = typeof data?.processed === 'number' ? data.processed : 0
      const results = Array.isArray(data?.results) ? data.results : []
      const failed = results.filter((r: any) => r.status === 'failed')
      if (failed.length > 0) {
        const msg = failed[0]?.error || 'Unknown error'
        toast.error(`Processor failed for ${failed.length} item(s): ${msg}`)
      } else {
        toast.success(`Processor ran: processed ${processed}`)
      }
      queryClient.invalidateQueries({ queryKey: ['delivery-queue'] })
    },
    onError: (error) => {
      console.error('Processor error:', error)
      toast.error(`Processor failed: ${error.message}`)
    }
  })

  return {
    scheduleDelivery: scheduleDelivery.mutate,
    cancelScheduledDelivery: cancelScheduledDelivery.mutate,
    updateScheduledDelivery: updateScheduledDelivery.mutate,
    runDeliveryProcessor: runDeliveryProcessor.mutate,
    isScheduling: scheduleDelivery.isPending,
    isCancelling: cancelScheduledDelivery.isPending,
    isUpdating: updateScheduledDelivery.isPending,
    isRunningProcessor: runDeliveryProcessor.isPending,
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
        .in('status', ['scheduled', 'processing', 'sent', 'failed'])
        .order('scheduled_for', { ascending: true })

      if (error) throw error
      return data || []
    },
    enabled: true,
    refetchInterval: 30000 // Refresh every 30 seconds
  })
}
