
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface ScrapeRequest {
  source_id: string
  user_id: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { source_id, user_id }: ScrapeRequest = await req.json()

    console.log(`Starting content scrape for source: ${source_id}`)

    // Get source details
    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .select('*')
      .eq('id', source_id)
      .eq('user_id', user_id)
      .single()

    if (sourceError || !source) {
      throw new Error(`Source not found: ${sourceError?.message}`)
    }

    // Update sync status to 'syncing'
    await supabase
      .from('sources')
      .update({ 
        sync_status: 'syncing',
        last_sync_at: new Date().toISOString(),
        sync_error: null
      })
      .eq('id', source_id)

    let scrapedContent = []

    // Route to appropriate scraper based on source type
    switch (source.source_type) {
      case 'rss':
        scrapedContent = await scrapeRSSFeed(source)
        break
      case 'twitter':
        scrapedContent = await scrapeTwitter(source)
        break
      case 'linkedin':
        scrapedContent = await scrapeLinkedIn(source)
        break
      default:
        throw new Error(`Unsupported source type: ${source.source_type}`)
    }

    // Store ingested content
    const contentInserts = scrapedContent.map(content => ({
      user_id,
      source_id,
      url: content.url,
      title: content.title,
      raw_content: content.content,
      content_md: content.markdown || null,
      content_html: content.html || null,
      hash: generateContentHash(content.content),
      published_at: content.published_at,
      metadata: content.metadata || {},
      status: 'fetched'
    }))

    const { data: insertedContent, error: insertError } = await supabase
      .from('ingested_contents')
      .upsert(contentInserts, { 
        onConflict: 'hash',
        ignoreDuplicates: true 
      })
      .select()

    if (insertError) {
      throw new Error(`Failed to insert content: ${insertError.message}`)
    }

    // Update source status to completed
    await supabase
      .from('sources')
      .update({ 
        sync_status: 'completed',
        last_sync_at: new Date().toISOString(),
        metrics: {
          ...source.metrics,
          last_scrape_count: scrapedContent.length,
          total_scraped: (source.metrics?.total_scraped || 0) + scrapedContent.length
        }
      })
      .eq('id', source_id)

    // Trigger topic extraction for new content
    if (insertedContent && insertedContent.length > 0) {
      for (const content of insertedContent) {
        // Call topic extractor function
        await fetch(`${supabaseUrl}/functions/v1/llm-topic-extractor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content_id: content.id,
            user_id
          })
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        scraped_count: scrapedContent.length,
        inserted_count: insertedContent?.length || 0,
        source_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Content scraper error:', error)

    // Update source with error status
    if (req.json) {
      const { source_id } = await req.json()
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await supabase
        .from('sources')
        .update({ 
          sync_status: 'failed',
          sync_error: error.message
        })
        .eq('id', source_id)
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function scrapeRSSFeed(source: any) {
  const feedUrl = source.source_url
  console.log(`Scraping RSS feed: ${feedUrl}`)

  try {
    const response = await fetch(feedUrl)
    const feedXML = await response.text()
    
    // Parse RSS/Atom feed
    const parser = new DOMParser()
    const doc = parser.parseFromString(feedXML, 'text/xml')
    
    const items = []
    const entries = doc.querySelectorAll('item, entry')
    
    for (const entry of Array.from(entries).slice(0, 20)) { // Limit to 20 items
      const title = entry.querySelector('title')?.textContent || ''
      const link = entry.querySelector('link')?.textContent || 
                   entry.querySelector('link')?.getAttribute('href') || ''
      const description = entry.querySelector('description, summary, content')?.textContent || ''
      const pubDate = entry.querySelector('pubDate, published, updated')?.textContent || ''
      
      if (title && link && description) {
        items.push({
          url: link,
          title: title.trim(),
          content: description.trim(),
          published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          metadata: {
            source_type: 'rss',
            feed_url: feedUrl
          }
        })
      }
    }
    
    return items
  } catch (error) {
    console.error('RSS scraping error:', error)
    throw new Error(`Failed to scrape RSS feed: ${error.message}`)
  }
}

async function scrapeTwitter(source: any) {
  // Twitter scraping would require API integration
  // For now, return mock data structure
  console.log(`Twitter scraping not yet implemented for: ${source.source_name}`)
  
  return []
}

async function scrapeLinkedIn(source: any) {
  // LinkedIn scraping would require API integration
  // For now, return mock data structure
  console.log(`LinkedIn scraping not yet implemented for: ${source.source_name}`)
  
  return []
}

function generateContentHash(content: string): string {
  // Simple hash function for content deduplication
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
