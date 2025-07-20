
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, sessionId, messages, message } = await req.json();
    
    // Perform different actions based on the request
    switch (action) {
      case 'saveMessage': {
        // Get existing session or create new one
        const { data: existingSession } = await supabase
          .from('chat_sessions')
          .select('messages')
          .eq('session_id', sessionId)
          .single();

        let updatedMessages = [];
        if (existingSession) {
          updatedMessages = [...existingSession.messages, message];
          
          // Update existing session
          await supabase
            .from('chat_sessions')
            .update({ messages: updatedMessages })
            .eq('session_id', sessionId);
        } else {
          // Create new session
          updatedMessages = [message];
          await supabase
            .from('chat_sessions')
            .insert({ 
              session_id: sessionId, 
              messages: updatedMessages 
            });
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      case 'getSession': {
        // Retrieve a chat session
        const { data: session } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single();
        
        return new Response(JSON.stringify({ 
          success: true, 
          data: session || { sessionId, messages: [] } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      case 'saveSession': {
        // Save full session (used when initializing with existing messages)
        const { data: existingSession } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('session_id', sessionId)
          .single();

        if (existingSession) {
          // Update existing session
          await supabase
            .from('chat_sessions')
            .update({ messages })
            .eq('session_id', sessionId);
        } else {
          // Create new session
          await supabase
            .from('chat_sessions')
            .insert({ 
              session_id: sessionId, 
              messages 
            });
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      case 'endSession': {
        // Delete the session when chat ends
        await supabase
          .from('chat_sessions')
          .delete()
          .eq('session_id', sessionId);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in mongodb-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "An error occurred while processing your request" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});