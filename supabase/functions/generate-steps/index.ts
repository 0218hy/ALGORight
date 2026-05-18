// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

//read API key 
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

Deno.serve(async (req) => {
  try {
    //read what the app sent (input)
    const { algorithm, inputData } = await req.json() 

    //validate input 
    if (!algorithm || !inputData) {
      return new Response(
        JSON.stringify( { error: 'algorithm and inputData are required'}), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    //prompt for Gemini
    const prompt = `Generate step by step execution of ${algorithm} on input ${JSON.stringify(inputData)}.
    
For sorting algorithms, each step must have:
- algorithmType: always the string "sorting"
- array: current state of the array as a number array
- comparing: exactly 2 indices being compared as a number array
- swapped: boolean, true if a swap occurred at this step
- sorted: indices already in their final sorted position as a number array

For tree algorithms, each step must have:
- algorithmType: always the string "tree"
- tree: current state of the tree
- visited: current node being visited as a number
- action: string describing what is happening

For graph algorithms, each step must have:
- algorithmType: always the string "graph"
- graph: current state of the graph
- visited: all visited nodes as a number array
- current: current node being processed as a number
- action: string describing what is happening

Example for bubble sort on [3,1,2]:
[
  {"algorithmType": "sorting", "array": [3,1,2], "comparing": [0,1], "swapped": false, "sorted": []},
  {"algorithmType": "sorting", "array": [1,3,2], "comparing": [0,1], "swapped": true, "sorted": []},
  {"algorithmType": "sorting", "array": [1,3,2], "comparing": [1,2], "swapped": false, "sorted": []},
  {"algorithmType": "sorting", "array": [1,2,3], "comparing": [1,2], "swapped": true, "sorted": [2]},
  {"algorithmType": "sorting", "array": [1,2,3], "comparing": [0,1], "swapped": false, "sorted": [1,2]},
  {"algorithmType": "sorting", "array": [1,2,3], "comparing": [], "swapped": false, "sorted": [0,1,2]}
]`

    //call Gemini API 
    //basic Gemini text request 
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
          contents:[{
            parts:[{text:prompt}]
          }]
        })
      }
    )

    //parse Gemini's response
    const geminiData = await response.json()
    console.log('Gemini response:', JSON.stringify(geminiData))
    
    const text = geminiData.candidates[0].content.parts[0].text

    //clean and parse the JSON 
    const cleaned = text.replace(/```json|```/g, '').trim()
    const steps = JSON.parse(cleaned)

    //return response to app
    return new Response(
      JSON.stringify({ steps }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
