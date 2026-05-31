import "@supabase/functions-js/edge-runtime.d.ts"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

Deno.serve(async (req) => {
  try {
    const { algorithmId, algorithmTitle, difficulty } = await req.json()

    //validation 
    if (!algorithmId || !algorithmTitle || !difficulty) {
      return new Response(
        JSON.stringify({ error: 'algorithmId, algorithmTitle and difficulty are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' }}
      )
    }

    // check if content already exists
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/algorithm_summaries?algorithm_id=eq.${algorithmId}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    )
    const existing = await checkResponse.json()

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Content already exists for this algorithm, skipping generation' 
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    //build prompt 
    const prompt = `Generate beginner-friendly learning content for ${algorithmTitle} algorithm (${difficulty} level).
  
Return ONLY a JSON object. No explanation. No markdown. Just raw JSON.

{
  "summary": {
    "content": "2-3 sentence overview a complete beginner can understand",
    "howItWorks": "step by step explanation max 5 steps each step one sentence",
    "keyPoints": ["3-5 key facts worth remembering in point form"],
    "whenToUse": "1-2 sentences on practical usage",
    "timeComplexity": "e.g. O(n²) worst and average case",
    "spaceComplexity": "e.g. O(1)"
  },
  "flashcards": [
    {
      "question": "question text",
      "answer": "detailed beginner friendly answer",
      "orderIndex": 1
    }
  ]
}

Generate exactly 10 flashcards covering:
1. What the algorithm is 
2. How the algorithm works 
3. Time complexity and why
4. Space complexity and why
5. When to use it vs when not to
6. Best case vs worst case scenario

Keep all language simple. Assume complete beginner.`

  //call Gemini
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  )

  const geminiData = await response.json()
  console.log('Gemini response:', JSON.stringify(geminiData))

  if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.log('Invalid Gemini response structure:', JSON.stringify(geminiData))
    return new Response(
      JSON.stringify({ error: 'Invalid response from Gemini' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const candidate = geminiData.candidates?.[0]
  const text = candidate?.content?.parts?.[0]?.text
  const cleaned = text.replace(/```json|```/g, '').trim()
  const content = JSON.parse(cleaned)

  // save to Supabase using service role key
  const supabaseResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/algorithm_summaries`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        algorithm_id: algorithmId,
        content: content.summary.content,
        how_it_works: content.summary.howItWorks,
        key_points: content.summary.keyPoints,
        when_to_use: content.summary.whenToUse,
        time_complexity: content.summary.timeComplexity,
        space_complexity: content.summary.spaceComplexity
      })
    }
  )

  // save flashcards
  const flashcards = content.flashcards.map((card: any) => ({
    algorithm_id: algorithmId,
    question: card.question,
    answer: card.answer,
    order_index: card.orderIndex
  }))

  await fetch(
      `${SUPABASE_URL}/rest/v1/flashcards`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(flashcards)
      }
    )

    return new Response(
      JSON.stringify({ success: true, algorithmTitle }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})



