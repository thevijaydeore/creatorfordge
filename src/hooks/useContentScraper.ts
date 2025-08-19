
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface ScrapeSourceParams {
  sourceId: string
  userId: string
}

export const useContentScraper = () => {
  const queryClient = useQueryClient()

  const scrapeSource = useMutation({
    mutationFn: async ({ sourceId, userId }: ScrapeSourceParams) => {
      console.log('Starting content scrape for source:', sourceId)
      
      const { data, error } = await supabase.functions.invoke('content-scraper', {
        body: {
          source_id: sourceId,
          user_id: userId
        }
      })

      if (error) {
        console.error('Scrape error:', error)
        throw new Error(error.message || 'Failed to scrape content')
      }

      return data
    },
    onSuccess: (data) => {
      toast.success(`Successfully scraped ${data.scraped_count} items`)
      // Invalidate relevant queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['sources'] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      queryClient.invalidateQueries({ queryKey: ['ingested-contents'] })
    },
    onError: (error) => {
      console.error('Scrape mutation error:', error)
      toast.error(`Scraping failed: ${error.message}`)
    }
  })

  return {
    scrapeSource: scrapeSource.mutate,
    isScraping: scrapeSource.isPending,
    scrapeError: scrapeSource.error
  }
}
