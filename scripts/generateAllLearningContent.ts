// scripts/generateAllLearningContent.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zsyxgvjoulzckhopyoqm.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeXhndmpvdWx6Y2tob3B5b3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MzY4ODUsImV4cCI6MjA5NDIxMjg4NX0.VkIMOFJ7TVZEkfhOO6DGQNvvduJdk6n_g0p0SDmxNUA'

console.log('Script starting...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const generateAll = async () => {
  console.log('generateAll called...') 

   // add timeout
  const timeout = setTimeout(() => {
    console.log('Timed out — check your Supabase URL and anon key')
    process.exit(1)
  }, 10000)  // 10 seconds

  //fetch all algorithms from DB
  const { data: algorithms, error } = await supabase
    .from('algorithms')
    .select('id, title, difficulty')

  clearTimeout(timeout)

  if (error) {
    console.error('Failed to fetch algorithms:', error)
    return
  }

  // fetch existing summaries
  const { data: existing } = await supabase
    .from('algorithm_summaries')
    .select('algorithm_id')

  // extract existing algorithm ids
  const existingIds = existing?.map(s => s.algorithm_id) ?? []

  // filter out already generated algorithms
  const toGenerate = algorithms.filter(a => !existingIds.includes(a.id))

  console.log(`${existingIds.length} already generated, ${toGenerate.length} remaining`)

  if (toGenerate.length === 0) {
    console.log('All algorithms already have content!')
    return
  }

  // generate for remaining algorithms only
  for (const algorithm of toGenerate) {
    console.log(`Generating content for ${algorithm.title}...`)

    const response = await fetch(
      'https://zsyxgvjoulzckhopyoqm.supabase.co/functions/v1/generate-learning-content',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          algorithmId: algorithm.id,
          algorithmTitle: algorithm.title,
          difficulty: algorithm.difficulty
        })
      }
    )

    const result = await response.json()

    if (result.success) {
      console.log(`${algorithm.title} — generated successfully`)
    } else {
      console.error(`${algorithm.title} — ${result.error}`)
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log('Done!')
}

generateAll()