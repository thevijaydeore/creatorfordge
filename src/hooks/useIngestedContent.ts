
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export const useIngestedContent = (userId?: string) => {
  return useQuery({
    queryKey: ['ingested-contents', userId],
    queryFn: async () => {
      console.log('Fetching ingested content for user:', userId)
      
      const { data, error } = await supabase
        .from('ingested_contents')
        .select(`
          *,
          sources(source_name, source_type)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching ingested content:', error)
        throw new Error(error.message)
      }

      return data || []
    },
    enabled: !!userId
  })
}

export const useIngestedContentById = (contentId: string) => {
  return useQuery({
    queryKey: ['ingested-content', contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingested_contents')
        .select('*')
        .eq('id', contentId)
        .single()

      if (error) {
        console.error('Error fetching content:', error)
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!contentId
  })
}
