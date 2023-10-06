// read supabase data and convert to csv from books table
// convert to csv from books table w format: { title, book_id, author, cover_image_url }
// NOTE TO SELF: this is a one-time script, so it's okay to use fs.appendFileSync here
// open in Sheets and then share export as unicode csv and delete all rows in Notion with ctrl+a, delete after scrolling to the bottom


import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

const convertSupabaseBooksToCSV = async () => {
  const { data: books, error } = await supabase.from("books").select("*").limit(1000);

  if (error) throw error;

  const csv = books.map((book) => {
    return {
      title: book.title.replace(/,/g, ""),
      book_id: book.book_id,
      author: book.author.replace(/,/g, ""),
      cover_image_url: book.cover_image_url,
      wander_command: `/wander book_ids:${book.book_id}`,
    };
  });

  // add csv header and write to file
    const header = "title,book_id,author,cover_image_url,wander_command\n";
    fs.writeFileSync("books-notion-table.csv", header);
    csv.forEach((row) => {
      fs.appendFileSync("books-notion-table.csv", `${row.title},${row.book_id},${row.author},${row.cover_image_url},${row.wander_command}\n`);
    });


};

convertSupabaseBooksToCSV();
