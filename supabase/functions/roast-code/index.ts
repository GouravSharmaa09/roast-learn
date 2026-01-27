import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `Tu ek senior developer hai jo Hinglish (Hindi + English mix) mein baat karta hai. Tera kaam hai developers ke code ka BAHUT BRUTAL roast karna - unhe feel karwana chahiye ki "bhai maine ye kya bakwas likh diya". 

IMPORTANT: Response SIRF valid JSON mein dena hai, koi extra text nahi.

Roast karte waqt:
- BAHUT harsh aur funny hona hai - user ko sharam aani chahiye
- Thodi gaali bhi daal sakta hai (ullu ka pattha, gadhe, bewakoof, pagal, etc.) but zyada personal mat ho
- Desi references use kar (chai, samosa, rickshaw, jugaad, Sharma ji ka beta, etc.)
- Bollywood dialogues twist karke use kar ("Tumse na ho payega", "Ye code dekh ke mere dil ko boht dukh hua", etc.)
- Cricket references bhi daal sakta hai
- Developer ki coding skills pe roast kar, but personally insult mat kar
- "Bhai", "yaar", "boss", "abe" jaise words use kar
- Roast padhke user hase bhi aur sharam bhi aaye

{
  "roast": "4-5 lines ka BAHUT BRUTAL roast. Thodi gaali bhi daal. Example: 'Abe saale, ye code dekh ke mujhe lagta hai tu neend mein likhta hai ya phir tujhe coding ki jagah sabzi bechni chahiye thi. Ye code itna ganda hai ki isko dekh ke Stack Overflow ne bhi haath jod liye. Sharma ji ke bete ne ye dekha toh usne bola - bhai mujhe lagta tha main bura coder hoon, but tujhe dekh ke confidence aa gaya. Ullu ke patthe, semicolon toh dhang se lagana seekh pehle!'",
  "whyThisHappens": "Hinglish mein explain kar ki beginners ye galti kyun karte hain. 'Dekh bhai, ye galti isliye hoti hai kyunki tu basics skip karke seedha project banane lag gaya. Jaise bina license ke gaadi chalaoge toh accident hoga, waise hi bina concepts samjhe code likhoge toh ye hoga.'",
  "realWorldProblems": "Production mein ye code se kya problems aayengi - Hinglish mein funny examples de. 'Abe agar ye code production mein gaya na toh client tujhe chappal se maarega. Server crash hoga, users gaali denge, aur tu LinkedIn pe new job dhundta milega.'",
  "stepByStepFix": [
    "Step 1: Pehle ye kar... (Hinglish mein with funny touch)",
    "Step 2: Phir ye fix kar... bewakoof mat ban",
    "Step 3: Last mein ye check kar... warna phir se roast khaega"
  ],
  "correctedCode": "// Ye dekh bhai, aise likhte hain proper code\\n// Gaur se dekh, aur yaad rakh\\nconst example = 'corrected code with Hinglish comments';",
  "goldenRule": "Ek yaad rakhne wala rule - funny aur memorable. Example: 'Jaise chai mein cheeni zaroori hai, waise code mein semicolon zaroori hai - dono bhoolega toh muh bighad jayega'",
  "mcqs": [
    {
      "question": "Hinglish mein sawaal - concept se related",
      "options": ["Option A Hinglish mein", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Hinglish mein kyun ye sahi hai - thoda funny bhi"
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
    "description": "Hinglish mein problem description - same concept pe based. Thoda challenging but doable.",
    "hint": "Hint bhi Hinglish mein - 'Agar ye bhi nahi aata toh coding chhod de'"
  }
}

YAAD RAKH:
1. Roast BAHUT BAHUT brutal hona chahiye - user ko lagni chahiye sharam
2. Thodi gaali daal sakta hai (ullu ka pattha, gadhe, bewakoof, pagal, etc.)
3. Sab kuch Hinglish mein - Hindi + English mix naturally
4. Bollywood, cricket, desi uncle references use kar
5. Funny but educational hona chahiye - hasna bhi aaye, seekhna bhi ho
6. Code comments bhi Hinglish mein likhi`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, mode, userExplanation, correctedCode } = await req.json();
    
    // Handle "explain-back" mode
    if (mode === "explain-back") {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ feedback: "Check nahi ho paya", passed: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const explainPrompt = `Tu ek strict teacher hai. User ne ye ${language} code dekha:
\`\`\`${language}
${code}
\`\`\`

Corrected code:
\`\`\`${language}
${correctedCode}
\`\`\`

User ka explanation: "${userExplanation}"

Kya user ne sahi samjha ki bug kya tha aur kyun fix karna pada? 
Response Hinglish mein de. Sirf JSON return kar:
{
  "feedback": "2-3 lines mein Hinglish feedback - funny bhi ho sakta hai",
  "passed": true/false
}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "user", content: explainPrompt }],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      
      try {
        let jsonString = content.trim();
        if (jsonString.startsWith("```json")) jsonString = jsonString.slice(7);
        if (jsonString.startsWith("```")) jsonString = jsonString.slice(3);
        if (jsonString.endsWith("```")) jsonString = jsonString.slice(0, -3);
        const parsed = JSON.parse(jsonString.trim());
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch {
        return new Response(
          JSON.stringify({ feedback: "Theek hai bhai, chal aage badh.", passed: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

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

    const userPrompt = `Is ${language} code ka BAHUT BRUTAL roast kar Hinglish mein. Thodi gaali bhi daal (ullu ka pattha, gadhe, bewakoof types). User ko feel hona chahiye "maine ye kya bakwas likh diya":

\`\`\`${language}
${code}
\`\`\`

Yaad rakh - bahut harsh, funny, thodi gaali wala roast chahiye. User hase bhi aur sharam bhi aaye. 

IMPORTANT: "memoryHook" field mein ek catchy one-liner dena jo interview-ready ho, jaise:
- "Agar loop khatam ho gaya, variable ko bhi jaane do"
- "Null check na kiya toh production mein roya"
- "Async await bina try-catch, jaise helmet bina bike"

Response SIRF JSON mein.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite", // Faster model for quick responses
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8, // Slightly lower for faster, more focused responses
        max_tokens: 2500, // Reduced for faster response
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Abe thoda ruk, bahut zyada request aa rahi hai. Chai pi aur thodi der baad try kar." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service ka quota khatam ho gaya bhai." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Code analyze nahi ho paya. Dobara try kar bewakoof." }),
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
      
      // Ensure memoryHook exists
      if (!parsedContent.memoryHook) {
        parsedContent.memoryHook = parsedContent.goldenRule || "Code likhna seekh pehle, phir production pe push karna.";
      }
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
