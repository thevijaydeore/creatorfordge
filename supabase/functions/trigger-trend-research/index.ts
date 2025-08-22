
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL')!
const n8nWebhookSecret = Deno.env.get('N8N_WEBHOOK_SECRET')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Verify JWT token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Missing authorization header', { status: 401, headers: corsHeaders })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response('Invalid token', { status: 401, headers: corsHeaders })
    }

    const { title, categories = [] } = await req.json()

    if (!title) {
      return new Response('Title is required', { status: 400, headers: corsHeaders })
    }

    // Check rate limiting
    const { data: canTrigger } = await supabase.rpc('can_trigger_trend_research', {
      p_user_id: user.id,
      p_minutes: 5
    })

    if (!canTrigger) {
      return new Response('Rate limit exceeded. Please wait 5 minutes between requests.', { 
        status: 429, 
        headers: corsHeaders 
      })
    }

    // Generate n8n execution ID for idempotency
    const executionId = `${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Insert pending record
    const { data: trendRecord, error: insertError } = await supabase
      .from('trend_research')
      .insert({
        user_id: user.id,
        title,
        categories,
        status: 'pending',
        n8n_execution_id: executionId
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response('Failed to create trend research record', { status: 500, headers: corsHeaders })
    }

    // Create HMAC signature for n8n webhook
    const payload = JSON.stringify({
      execution_id: executionId,
      user_id: user.id,
      trend_id: trendRecord.id,
      title,
      categories
    })

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(n8nWebhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Trigger n8n workflow
    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': `sha256=${signatureHex}`
        },
        body: payload
      })

      if (!n8nResponse.ok) {
        throw new Error(`n8n webhook failed: ${n8nResponse.status}`)
      }

      // Update status to processing
      await supabase
        .from('trend_research')
        .update({ status: 'processing' })
        .eq('id', trendRecord.id)

      return new Response(JSON.stringify({
        success: true,
        trend_id: trendRecord.id,
        execution_id: executionId,
        status: 'processing'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } catch (webhookError) {
      console.error('n8n webhook error:', webhookError)
      
      // Update record with error
      await supabase
        .from('trend_research')
        .update({ 
          status: 'failed',
          error_message: `Webhook failed: ${webhookError.message}`
        })
        .eq('id', trendRecord.id)

      return new Response('Failed to trigger n8n workflow', { status: 500, headers: corsHeaders })
    }

  } catch (error) {
    console.error('Function error:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})
