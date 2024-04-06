import { createClient } from '@supabase/supabase-js'
import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG,
  });
  
const openai = new OpenAIApi(configuration);

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
})

export const getEmbedding = async (text) => {
    const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: text,
      });

    return response.data.data[0].embedding
}

const generateQuestion = async (text) => {
    try {
      const highlight = text;
  
      const prompt = `Generate a single question from this quote. The end user cannot see the quote so DO NOT use any abstract concepts like "the speaker" or "the writer" in your question. BE EXPLICIT. DO NOT ASSUME the reader has read the quote. DO NOT use passive voice and do not use passive pronouns like he/she/they/him/her etc. You can use any of who/what/where/when/why. Say nothing else.\n\nQuote:\n\n${highlight}\n\nQ:`;
  
      console.log("prompt: " + highlight);
      const completion = await openai.createChatCompletion({
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo",
      });
  
      const content = completion.data.choices[0].message.content;
  
      return content;
    } catch (err) {
      console.log("START ERROR")
      console.error(err);
      console.error(err.response);
      console.error(err.response.data);
      console.error(err.response.data.error);
      console.error(err.response.data.error.message);
      console.error(err.response.data.error.code);
      console.error(err.response.data.error.status);
      console.error(err.response.data.error.request);
      console.log("END ERROR")
      throw err;
    }
  };

const convertReadwiseHighlightsToSupabase = async (data) => {
    for (const highlightWrapper of data) {
        const highlights = highlightWrapper.highlights
        const title = highlightWrapper.title
        const author = highlightWrapper.author
        const cover_image_url = highlightWrapper.cover_image_url
        const readwise_book_url = highlightWrapper.readwise_url
        const asin = highlightWrapper.asin
        const book_id = highlightWrapper.user_book_id


    /*
    schema for highlights and books

    {
	id
	text
	location
	location_type
	created_at
	readwise_url
	book_id
	book
		title
		author
		cover_image_url
		readwise_url
        book_id
    }
    */

    // insert books from highlights if they don't exist
        const bookExists = await supabase.from('books').select('*').eq('book_id', book_id)

        if (!bookExists.data.length > 0) {
            const { data, error } = await supabase.from('books').insert({
                title,
                author,
                cover_image_url,
                readwise_url: readwise_book_url,
                asin,
                book_id
            })

            if (error) {
                console.log(error)
            } else {
                console.log(`book: ${title} inserted`)
            }
        }  else {
            console.log(`book: ${title} already exists`)
        }

        // insert highlights
        // every 2950 highlights, wait 1 minute
        let i = 0
        for (const highlight of highlights) {

            // not really necessary since it takes ~1 second to embed each highlight anyway so it's not like we're hitting the rate limit but just in case
            // if (i % 2950 === 0 && i !== 0) {
            //     console.log("waiting 1 minute")
            //     await new Promise(resolve => setTimeout(resolve, 60000));
            // }
            // i++

            const text = highlight.text
            const location = highlight.location
            const location_type = highlight.location_type
            const created_at = highlight.highlighted_at
            const readwise_url = highlight.readwise_url
            const book_id = highlight.book_id
            const id = highlight.id

            // check if highlight exists
            const highlightExists = await supabase.from('highlights').select('*').eq('id', id)

            if (!highlightExists.data.length > 0) {
                const embeddingArr = await getEmbedding(text)
                const question = await generateQuestion(text)

                const { data, error } = await supabase.from('highlights').insert({
                    text,
                    location,
                    location_type,
                    created_at,
                    readwise_url,
                    book_id,
                    embedding: embeddingArr,
                    id,
                    question
                })

                if (error) {
                    console.log(error)
                } else {
                    console.log(`highlight: ${text} inserted`)
                }
            } else {
                console.log(`highlight: ${text} already exists`)
            }
        }
    }

}

const filterHighlightsByCategory = (highlights, category) => {
    return highlights.filter(highlight => highlight.category === category)
}

// data json should be in the same directory as this file generated from readwise-highlights.py
const justBooks = async () => {
    // read data.json using fs
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    const filteredData = filterHighlightsByCategory(data, "books")
    /*
    map over filteredData and aggregate by title to create the following MD string log:
    **New Quotes Added!**\n\nfor(title in titles){num_quotes in json} from {title}
    */
    const titles = {}
    for (const book of filteredData) {
        if (!titles[book.title]) {
            titles[book.title] = {}
            titles[book.title]["numHighlights"] = book.highlights.length
            titles[book.title]["author"] = book.author
        }
    }

    let mdString = "**New Quotes Added!**\n\n"
    for (const title in titles) {
        mdString += `**${titles[title].numHighlights} quotes** from *${title}* by ${titles[title].author}\n`
    }


    console.log(mdString)

    await convertReadwiseHighlightsToSupabase(filteredData)

    // log the number of highlights to see if it matches the number of highlights in the readwise account
    // // aggregate all highlights into one array
    // const highlights = []
    // for (const book of filteredData) {
    //     highlights.push(...book.highlights)
    // }

    // console.log(highlights.length)
}

// justBooks() only runs if flag is set and also in termina process arg is set
if (process.env.DEV && process.argv[2] === 'justBooks') {
    justBooks()
}