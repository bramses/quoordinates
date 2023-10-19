import { getEmbedding } from "./embed-into-supabase.js"
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
})

// add thought to highlight.thought JSONB column
// schema == [{ "thoughtId": uuid, "thought": string, "userId": int, "createdAt": timestamp }]

export const addThoughtToHighlight = async (highlightId, thought, userId) => {
    const { data: highlight, error } = await supabase.from('highlights').select('*').eq('id', highlightId)

    if (error) {
        console.log(error)
        return
    }

    const thoughts = highlight[0].thoughts

    const thoughtObj = {
        thoughtId: uuidv4(),
        thought: thought,
        userId: userId,
        createdAt: new Date().toISOString()
    }

    if (!thoughts) {
        const newThoughts = [thoughtObj]
        const { data: updatedHighlight, error: updateError } = await supabase.from('highlights').update({ thoughts: newThoughts }).eq('id', highlightId)

        if (updateError) {
            console.log(updateError)
            return
        }

        return updatedHighlight
    }

    const newThoughts = [...thoughts, thoughtObj]
    const { data: updatedHighlight, error: updateError } = await supabase.from('highlights').update({ thoughts: newThoughts }).eq('id', highlightId)

    if (updateError) {
        console.log(updateError)
        return
    }

    return updatedHighlight
}

// test
// addThoughtToHighlight('592371723', 'this is a test thought', 1).then(res => console.log(res))