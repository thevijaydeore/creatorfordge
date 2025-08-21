
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface ScrapeSourceParams {
  sourceId: string
  userId: string
}

interface ImportTweetParams {
  sourceId: string
  userId: string
  url: string
}

export const useContentScraper = () => {
  const queryClient = useQueryClient()

  const scrapeSource = useMutation({
    mutationFn: async ({ sourceId, userId }: ScrapeSourceParams) => {
      console.log('Starting content scrape for source:', sourceId)
      
      // Ensure Authorization header is present for verify_jwt
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const { data, error } = await supabase.functions.invoke('content-scraper', {
        body: {
          source_id: sourceId,
          user_id: userId
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
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

  const scrapeAllTwitter = useMutation({
    mutationFn: async (userId: string) => {
      // Fetch all twitter sources for user and invoke scraper sequentially
      const { data: sources, error } = await supabase
        .from('sources')
        .select('id')
        .eq('user_id', userId)
        .eq('source_type', 'twitter')
      if (error) throw error
      const results: any[] = []
      for (const s of (sources || [])) {
        const { data, error: scrapeError } = await supabase.functions.invoke('content-scraper', {
          body: { source_id: s.id, user_id: userId }
        })
        if (scrapeError) throw scrapeError
        results.push(data)
      }
      return results
    },
    onSuccess: () => {
      toast.success('Twitter sources queued for scraping')
      queryClient.invalidateQueries({ queryKey: ['sources'] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      queryClient.invalidateQueries({ queryKey: ['ingested-contents'] })
    },
    onError: (error) => {
      console.error('Bulk scrape error:', error)
      toast.error(`Bulk scrape failed: ${error.message}`)
    }
  })

  const importTweetUrl = useMutation({
    mutationFn: async ({ sourceId, userId, url }: ImportTweetParams) => {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      const { data, error } = await supabase.functions.invoke('content-scraper', {
        body: { source_id: sourceId, user_id: userId, tweet_url: url },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Imported 1 tweet')
      queryClient.invalidateQueries({ queryKey: ['sources'] })
      queryClient.invalidateQueries({ queryKey: ['topics'] })
      queryClient.invalidateQueries({ queryKey: ['ingested-contents'] })
    },
    onError: (error) => {
      toast.error(`Import failed: ${error.message}`)
    }
  })

  return {
    scrapeSource: scrapeSource.mutate,
    scrapeAllTwitter: scrapeAllTwitter.mutate,
    importTweetUrl: importTweetUrl.mutate,
    isImporting: importTweetUrl.isPending,
    isScraping: scrapeSource.isPending,
    scrapeError: scrapeSource.error
  }
}
