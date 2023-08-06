import { getEmbedding } from "./embed-into-supabase.js"
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import clipboard from 'clipboardy';

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
})

// get a single highlight
export const getHighlight = async (id) => {
    const { data: highlights, error } = await supabase.from('highlights').select('*').eq('id', id)

    if (error) { 
        console.log(error)
        return
    }

    return highlights[0]
}

// copy a highlight.embedding to clipboard
export const copyHighlightEmbedding = async (id) => {
    const highlight = await getHighlight(id)
    const embedding = highlight.embedding

    clipboard.writeSync(embedding)
}

async function main() {
    const id = process.argv[2]
    await copyHighlightEmbedding(id)
}

main()