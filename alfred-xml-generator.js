import { getEmbedding } from "./embed-into-supabase.js"
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import xml2js from 'xml2js'

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

const similaritySearch = async (query) => {
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
            similarity: document.similarity
        })
    }

    if (error) { 
        console.log(error)
        return
    }

    return res
}

/*

convert the similarity search results to alfred format

echo "<?xml version='1.0'?><items>"
"<item uid='$project' arg='$project$unicode_split' query='$query' valid='YES'><title>$project</title><subtitle>Append to Resources.md in this project</subtitle></item>"
echo "</items>"
*/

// const convertToAlfred = async (query) => {
//     let idIndex = 0
//     const results = await similaritySearch(query)
//     const sortedResults = results.sort((a, b) => b.similarity - a.similarity)
//     console.log("<?xml version='1.0'?><items>")
//     for (const result of sortedResults) {
//         console.log(`<item uid='${idIndex}' arg='${result.text}' query='${query}' valid='YES'><title>${result.text}</title><subtitle>${result.title} - ${result.similarity}</subtitle></item>`)
//         idIndex++
//     }
//     console.log("</items>")
// }


const convertToAlfred = async (query) => {
    let idIndex = 0;
    const results = await similaritySearch(query);
    const sortedResults = results.sort((a, b) => b.similarity - a.similarity);

    const items = sortedResults.map(result => ({
        '$': {
            uid: idIndex++,
            arg: result.text,
            query: query,
            valid: 'YES',
        },
        title: [result.text],
        subtitle: [`${result.title} - ${result.similarity}`]
    }));

    const builder = new xml2js.Builder();
    const xml = builder.buildObject({ items: { item: items } });

    console.log(xml);
}

// run semantic search on terminal arg (include spaces) and remove the ? at the end
convertToAlfred(process.argv.slice(2).join(" ").replace("?", ""))