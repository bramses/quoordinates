/*
1. get all books in book DB
if cover_image_url_large is null, get book cover image from http://localhost:2000/bookcover?book_title=book+title&author_name=book+author which will return JSON in form 
{
	"url": "..."
}
2. insert book cover image into book DB
3. if not null, skip
*/

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

const getBooks = async () => {
    const { data, error } = await supabase
        .from("books")
        .select("*");
    
    if (error) {
        console.error(error);
        return [];
    }
    
    return data;
    };

const getBookCover = async (bookTitle, authorName) => {
    // convert to url format
    bookTitle = bookTitle.replace(" ", "+");
    // convert any : or & etc
    bookTitle = encodeURIComponent(bookTitle);
    authorName = authorName.replace(" ", "+");
    authorName = encodeURIComponent(authorName);

    try {
        const url = `http://localhost:2000/bookcover?book_title=${bookTitle}&author_name=${authorName}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            console.log(url);
            return { error: data.error };
        }
        return data.url;
    } catch (err) {
        console.error(err);
        return { error: err };
    }
}

const updateBookCover = async (bookId, bookCoverUrl) => {
    const { data, error } = await supabase
        .from("books")
        .update({ cover_image_url_large: bookCoverUrl })
        .eq("book_id", bookId);
    
    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

const main = async () => {
    const books = await getBooks();
    for (const book of books) {
        if (book.cover_image_url_large === null) {
            console.log(`Getting book cover image for ${book.title}.`);
            const bookCoverUrl = await getBookCover(book.title, book.author);
            console.log(bookCoverUrl);
            if (bookCoverUrl === null || bookCoverUrl.error) {
                console.error(`Failed to get book cover image for ${book.title}.`);
                if (bookCoverUrl.error) {
                    console.error(bookCoverUrl.error);
                }
                continue;
            }
            await updateBookCover(book.book_id, bookCoverUrl);
            console.log(`Book cover image for ${book.title} updated.`);
        } else {
            console.log(`Book cover image for ${book.title} already exists.`);
        }
    }
}

if (process.env.DEV) {
    main();
  }
