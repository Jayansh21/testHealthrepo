
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    const { prompt, previousMessages = [] } = await req.json();

    // Create a context from previous messages
    let contextText = "";
    if (previousMessages.length > 0) {
      contextText = "Previous conversation context:\n";
      previousMessages.forEach((msg: { role: string; content: string }) => {
        contextText += `${msg.role === 'bot' ? 'MedAssist' : 'User'}: ${msg.content}\n`;
      });
      contextText += "\nBased on this conversation context, please respond to the user's current message:\n";
    }

    // Updated API endpoint to use the Gemini API v1 instead of v1beta
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are MedAssist, an Indian healthcare assistant focused on providing EXTREMELY CONCISE medical information. Follow these strict guidelines:

                1. ONLY answer health and medical questions - firmly but politely refuse all other topics.
                
                2. Keep ALL responses VERY SHORT - typically 1-3 sentences maximum, using bullet points where possible.
                
                3. Focus on Indian healthcare context - mention Indian medical services, hospitals (AIIMS, Apollo, Fortis), and use Indian emergency numbers (102, 108).
                
                4. When suggesting specialists, reference Indian qualifications (MBBS, MD, MS, AYUSH, etc).
                
                5. For medications, only mention those available in India, with a brief disclaimer about consulting a doctor.
                
                6. Structure responses with clear headings and bullet points when appropriate.
                
                7. For emergencies, always emphasize contacting emergency services immediately.
                
                8. Ask relevant follow-up questions ONLY when truly needed for better assistance.
                
                9. Format responses efficiently - use line breaks and separators for easy reading.
                
                10. For complex conditions, prioritize mentioning which specialist to consult rather than explaining the condition in detail.
                
                ${contextText}
                
                User query: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500, // Reduced token limit to encourage brevity
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    
    // Updated to handle the response format of the v1 Gemini API
    let generatedText = "";
    try {
      // Extract the generated text from the v1 API response format
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                      "I'm sorry, I can only assist with medical questions. How can I help with your health concern?";
      
      console.log("Successfully generated response:", generatedText.substring(0, 100) + "...");
    } catch (e) {
      console.error("Error parsing Gemini response:", e);
      console.error("Response data:", JSON.stringify(data, null, 2));
      
      if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      throw new Error("Unexpected response format from Gemini API");
    }

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-health-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "An error occurred while processing your request" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
