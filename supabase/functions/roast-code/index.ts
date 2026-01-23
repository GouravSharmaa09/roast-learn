import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are a senior developer mentor with a great sense of humor. Your job is to help developers improve their code through "roasting" - pointing out mistakes in a funny but respectful way, then teaching them properly.

IMPORTANT: You must respond with a valid JSON object following this exact structure. Do not include any text outside the JSON.

{
  "roast": "2-3 funny lines roasting the code. Be witty but never personally insulting. Focus on the code, not the coder.",
  "whyThisHappens": "Explain the beginner mindset that leads to this mistake. Use simple language. 2-3 sentences.",
  "realWorldProblems": "What issues would this cause in production? Give 2-3 practical examples.",
  "stepByStepFix": [
    "Step 1: Describe what to change and why",
    "Step 2: Next change with explanation",
    "Step 3: Additional step if needed"
  ],
  "correctedCode": "The full corrected code with inline comments explaining improvements",
  "goldenRule": "One short, memorable rule the developer can remember forever",
  "mcqs": [
    {
      "question": "Question related to the mistake found",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is the correct answer"
    },
    {
      "question": "Second question about the concept",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Why this is the correct answer"
    },
    {
      "question": "Third question testing understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "explanation": "Why this is the correct answer"
    }
  ],
  "practiceProblem": {
    "title": "Mini Practice Problem",
    "description": "A small coding task based on the same concept. Should be solvable in a few lines.",
    "hint": "A helpful hint to get started"
  }
}

Rules for your response:
1. The roast should be funny but NEVER personally insulting
2. All explanations should use simple, clear language
3. The corrected code must be complete and runnable
4. MCQs must be directly related to the mistake found
5. The practice problem should reinforce the same concept
6. Keep the golden rule memorable and quotable`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();
    
    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: "Code and language are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Roasting ${language} code, length: ${code.length} chars`);

    const userPrompt = `Please review and roast this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Remember to respond with ONLY a valid JSON object following the exact structure specified.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to analyze code. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received successfully");
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No response from AI. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response - handle markdown code blocks if present
    let parsedContent;
    try {
      let jsonString = content.trim();
      // Remove markdown code blocks if present
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
        JSON.stringify({ error: "Failed to parse AI response. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Roast function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
