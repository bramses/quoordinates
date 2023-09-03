import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
})


// Function to fetch a random highlight
export const fetchRandomHighlight = async () => {
    try {
        // Fetch a subset of 10 random IDs from the highlights table
        const { data: ids, error } = await supabase
            .rpc('fetch_random_ids');

        if (error) throw error;

        console.log(ids); // Log the response to see its structure

        // Pick a random ID from the subset
        const randomIndex = Math.floor(Math.random() * ids.length);
        const randomId = ids[randomIndex];

        // Fetch the highlight with the random ID
        const { data: highlight, error: highlightError } = await supabase
            .from('highlights')
            .select('*')
            .eq('id', randomId);

        // fetch the book associated with the highlight from book_id
        const { data: book, error: bookError } = await supabase
            .from('books')
            .select('*')
            .eq('book_id', highlight[0].book_id);

        // add the book to the highlight
        highlight[0].book = book[0];

        if (highlightError) throw highlightError;

        console.log('Random Highlight:', highlight);

        return highlight;
    } catch (error) {
        console.error('Error fetching random highlight:', error);
    }
};

// Fetch a random highlight
// fetchRandomHighlight();
