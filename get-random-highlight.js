import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});
export async function fetchRandomHighlightInBookID(bookIds, amount) {
  try {
    if (!amount) amount = 1;
    if (amount > 10) amount = 10;

    console.log(bookIds);

    // Fetch a subset of 10 random IDs from the highlights table
    const { data: ids_table, error } = await supabase.rpc(
      "fetch_random_ids_by_book_ids",
      { book_ids: bookIds }
    );

    const ids = ids_table.map((id) => id.id); 


    if (error) throw error;

    const highlights = [];

    for (let i = 0; i < amount; i++) {
      // Pick a random ID from the subset
      const randomIndex = Math.floor(Math.random() * ids.length);
      const randomId = ids[randomIndex];

      // Fetch the highlight with the random ID
      const { data: highlight, error: highlightError } = await supabase
        .from("highlights")
        .select("*")
        .eq("id", randomId);

      // fetch the book associated with the highlight from book_id
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("*")
        .eq("book_id", highlight[0].book_id);

      // add the book to the highlight
      highlight[0].book = book[0];

      if (highlightError) throw highlightError;

      highlights.push(highlight[0]);
      // remove the ID from the subset
      ids.splice(randomIndex, 1);
    }

    return highlights;
  } catch (err) {
    console.error("Error fetching random highlight from books:", err);
  }
}

// Function to fetch a random highlight
export const fetchRandomHighlight = async (amount) => {
  try {
    if (!amount) amount = 1;
    if (amount > 10) amount = 10;

    // Fetch a subset of 10 random IDs from the highlights table
    const { data: ids, error } = await supabase.rpc("fetch_random_ids");

    if (error) throw error;

    // console.log(ids); // Log the response to see its structure

    const highlights = [];

    for (let i = 0; i < amount; i++) {
      // Pick a random ID from the subset
      const randomIndex = Math.floor(Math.random() * ids.length);
      const randomId = ids[randomIndex];

      // Fetch the highlight with the random ID
      const { data: highlight, error: highlightError } = await supabase
        .from("highlights")
        .select("*")
        .eq("id", randomId);

      // fetch the book associated with the highlight from book_id
      const { data: book, error: bookError } = await supabase
        .from("books")
        .select("*")
        .eq("book_id", highlight[0].book_id);

      // add the book to the highlight
      highlight[0].book = book[0];

      if (highlightError) throw highlightError;

      highlights.push(highlight[0]);
      // remove the ID from the subset
      ids.splice(randomIndex, 1);
    }

    return highlights;
  } catch (error) {
    console.error("Error fetching random highlight:", error);
  }
};

// Fetch a random highlight
// fetchRandomHighlight(5).then((data) => console.log(data.length));
// Fetch a random highlight in a book
// fetchRandomHighlightInBookID([1474857, 3288110, 6928984, 1474862, 1474858], 5).then((data) => // console.log(data.map((d) => d.book.title)));
