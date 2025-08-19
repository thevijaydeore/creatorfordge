
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface GenerateContentParams {
  topicId?: string
  userId: string
  platform: string
  contentType: string
  prompt?: string
  researchId?: string
}

export const useContentGeneration = () => {
  const queryClient = useQueryClient()

  const generateContent = useMutation({
    mutationFn: async (params: GenerateContentParams) => {
      console.log('Generating content:', params)
      
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: {
          topic_id: params.topicId,
          user_id: params.userId,
          platform: params.platform,
          content_type: params.contentType,
          prompt: params.prompt,
          research_id: params.researchId
        }
      })

      if (error) {
        console.error('Content generation error:', error)
        throw new Error(error.message || 'Failed to generate content')
      }

      return data
    },
    onSuccess: (data) => {
      toast.success('Content generated successfully!')
      queryClient.invalidateQueries({ queryKey: ['drafts'] })
    },
    onError: (error) => {
      console.error('Content generation mutation error:', error)
      toast.error(`Content generation failed: ${error.message}`)
    }
  })

  return {
    generateContent: generateContent.mutate,
    isGenerating: generateContent.isPending,
    generationError: generateContent.error
  }
}
