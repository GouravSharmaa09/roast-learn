import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, mode } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "Image data chahiye bhai" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service configure nahi hai" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing image, mode: ${mode}`);

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "extract-code") {
      systemPrompt = `Tu ek OCR expert hai jo images se code extract karta hai. Tera kaam hai:
1. Image mein jo code dikhai de raha hai usse accurately extract karna
2. Code ki formatting maintain karna (indentation, line breaks, etc.)
3. Agar image mein code nahi hai ya unclear hai toh error message dena

Response SIRF JSON mein:
{
  "code": "extracted code yahan (agar code mila)",
  "language": "detected language (javascript/python/cpp/java/unknown)",
  "confidence": "high/medium/low",
  "error": "error message agar code nahi mila ya unclear hai"
}`;

      userPrompt = "Is image se code extract kar. Agar code nahi dikh raha ya unclear hai toh error bata.";
    } else {
      // Question/Problem solving mode
      systemPrompt = `Tu ek Hinglish mein baat karne wala coding tutor hai. User ne ek coding question/problem ki photo bheji hai. Tera kaam hai:
1. Question samajhna
2. Hinglish mein explain karna (Hindi + English mix)
3. Step-by-step solution dena
4. Code example dena agar zarurat ho

BAHUT friendly aur funny hona hai - jaise ek dost samjha raha ho.

Response JSON mein:
{
  "questionSummary": "Question kya pooch raha hai - short summary",
  "explanation": "Detailed explanation Hinglish mein - funny examples ke saath",
  "approach": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "code": "Solution code agar applicable",
  "tips": "Ek helpful tip ya trick",
  "error": "Error message agar question samajh nahi aaya"
}`;

      userPrompt = "Is image mein jo question/problem hai usse Hinglish mein samjha aur solve kar.";
    }

    // Remove data URL prefix to get base64 content
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: userPrompt },
              { 
                type: "image_url", 
                image_url: { 
                  url: `data:image/jpeg;base64,${base64Image}` 
                } 
              }
            ]
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Abe thoda ruk, bahut zyada request aa rahi hai." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service ka quota khatam ho gaya." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Image analyze nahi ho payi. Dobara try kar." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received successfully");
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "AI se response nahi aaya. Dobara try kar." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsedContent;
    try {
      let jsonString = content.trim();
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString.slice(7);
      } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.slice(3);
      }
      if (jsonString.endsWith("```")) {
        jsonString = jsonString.slice(0, -3);
      }
      parsedContent = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content.substring(0, 500));
      return new Response(
        JSON.stringify({ error: "AI ka response samajh nahi aaya. Dobara try kar." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analyze image error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Kuch gadbad ho gayi" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
