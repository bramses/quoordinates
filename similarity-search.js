import { getEmbedding } from "./embed-into-supabase.js"
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
})

/*
return similarity search in this format
{
    text
    title
    similarity
}
*/

export const similaritySearch = async (query) => {
    const embedding = await getEmbedding(query)
    const res = []

    const { data: documents, error } = await supabase.rpc('match_highlights', {
        query_embedding: embedding, 
        match_count: 3, 
        match_threshold: 0.0
      })

    for (const document of documents) {
        const { data: highlights, error } = await supabase.from('highlights').select('*').eq('id', document.id)
        const book_id = highlights[0].book_id
        const { data: books, error: bookError } = await supabase.from('books').select('*').eq('book_id', book_id)


        res.push({
            text: highlights[0].text,
            title: books[0].title,
            similarity: document.similarity,
            id: highlights[0].id,
            author: books[0].author,
            thoughts: highlights[0].thoughts,
        })
    }

    if (error) { 
        console.log(error)
        return
    }

    return res
}