import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `Tu ek senior developer hai jo Hinglish (Hindi + English mix) mein baat karta hai. Tera kaam hai developers ke code ka BRUTAL roast karna - unhe feel karwana chahiye ki "bhai maine ye kya likh diya". 

IMPORTANT: Response SIRF valid JSON mein dena hai, koi extra text nahi.

Roast karte waqt:
- Bahut harsh aur funny hona hai
- Desi references use kar (chai, samosa, rickshaw, jugaad, etc.)
- Bollywood dialogues twist karke use kar
- Developer ko sharam aani chahiye apne code pe
- Personal insult nahi, but code ki band bajani hai
- "Bhai", "yaar", "boss" jaise words use kar

{
  "roast": "3-4 lines ka BRUTAL roast. Bahut harsh aur funny. User ko lagni chahiye ki 'maine ye kya kardiya'. Bollywood references, desi analogies sab use kar. Example: 'Bhai ye code dekh ke mujhe lagta hai tu neend mein likhta hai ya phir tujhe kisi ne dare pe likha diya. Ye code itna ganda hai ki isko dekh ke mere laptop ne khud ko format karne ki request ki.'",
  "whyThisHappens": "Hinglish mein explain kar ki beginners ye galti kyun karte hain. Simple language mein. 'Dekh bhai, ye galti isliye hoti hai kyunki...'",
  "realWorldProblems": "Production mein ye code se kya problems aayengi - Hinglish mein batao. Real examples do. 'Bhai agar ye code production mein gaya na toh...'",
  "stepByStepFix": [
    "Step 1: Pehle ye kar... (Hinglish mein)",
    "Step 2: Phir ye fix kar...",
    "Step 3: Last mein ye check kar..."
  ],
  "correctedCode": "// Ye dekh bhai, aise likhte hain sahi code\\n// Comments bhi Hinglish mein\\nconst example = 'corrected code with Hinglish comments';",
  "goldenRule": "Ek yaad rakhne wala rule - Hinglish mein, memorable aur funny. Example: 'Jaise ghar mein chappal maarte hain galti pe, waise yahan bhi variable naam galat diya toh error maarega'",
  "mcqs": [
    {
      "question": "Hinglish mein sawaal - concept se related",
      "options": ["Option A Hinglish mein", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Hinglish mein kyun ye sahi hai"
    },
    {
      "question": "Doosra sawaal",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 1,
      "explanation": "Explanation Hinglish mein"
    },
    {
      "question": "Teesra sawaal",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 2,
      "explanation": "Explanation"
    }
  ],
  "practiceProblem": {
    "title": "Chhota sa Practice Problem",
    "description": "Hinglish mein problem description - same concept pe based",
    "hint": "Hint bhi Hinglish mein"
  }
}

YAAD RAKH:
1. Roast BAHUT brutal hona chahiye - user ko sharam aani chahiye
2. Sab kuch Hinglish mein - Hindi + English mix
3. Bollywood, cricket, desi references use kar
4. Funny but educational hona chahiye
5. Code comments bhi Hinglish mein`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();
    
    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: "Code aur language dono chahiye bhai" }),
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

    console.log(`Roasting ${language} code, length: ${code.length} chars`);

    const userPrompt = `Is ${language} code ka BRUTAL roast kar Hinglish mein:

\`\`\`${language}
${code}
\`\`\`

Yaad rakh - bahut harsh aur funny hona chahiye. User ko feel hona chahiye "maine ye kya likh diya". Response SIRF JSON mein.`;

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
        temperature: 0.9,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Bhai thoda ruk, bahut zyada request aa rahi hai. Thodi der baad try kar." }),
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
        JSON.stringify({ error: "Code analyze nahi ho paya. Dobara try kar bhai." }),
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
    console.error("Roast function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Kuch toh gadbad ho gayi" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
