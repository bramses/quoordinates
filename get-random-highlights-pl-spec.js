// get random highlights of arg value number and put them in format { data , metadata }
import { fetchRandomHighlight } from "./get-random-highlight.js";
import fs from "fs";

const convertToDataMetadata = async (amount, embeddings = false) => {
  const highlights = await fetchRandomHighlight(amount, true);
  const data = highlights.map((highlight) => highlight.text);
  const metadata = highlights.map((highlight) => {
    return {
      title: highlight.book.title,
      author: highlight.book.author,
      book_id: highlight.book.book_id,
      cover_image_url: highlight.book.cover_image_url,
      readwise_url: highlight.readwise_url,
      question: highlight.question,
      thoughts: highlight.thoughts,
    };
  });

  if (embeddings) {
    const embeddings = highlights.map((highlight) => highlight.embedding);
    return data.map((data, index) => {
      return { data: data, metadata: metadata[index], embedding: embeddings[index] };
    });
  }

  // zip data and metadata into an object and return it as an array
  const result = data.map((data, index) => {
    return { data: data, metadata: metadata[index] };
  });

  return result;
};

// write to csv file with headers: data, metadata
const saveAsCSV = async (amount, embeddings = false) => {
  const dataMetadata = await convertToDataMetadata(amount, embeddings);

  if (embeddings) {
    const csv = dataMetadata.map((row) => {
      const cleanData = row.data.replace(/,/g, "");
      const cleanMetadata = JSON.stringify(row.metadata).replace(/,/g, "");
      return `${cleanData},${JSON.stringify(cleanMetadata)},${row.embedding}`;
    });

    // add headers
    csv.unshift("data,metadata,embedding");

    const csvString = csv.join("\n");

    fs.writeFile("highlights.csv", csvString, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File has been created");
    });

    return;
  }

  const csv = dataMetadata.map((row) => {
    const cleanData = row.data.replace(/,/g, "");
    const cleanMetadata = JSON.stringify(row.metadata).replace(/,/g, "");
    return `${cleanData},${JSON.stringify(cleanMetadata)}`;
  });

  // add headers
  csv.unshift("data,metadata");

  const csvString = csv.join("\n");

  fs.writeFile("highlights.csv", csvString, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been created");
  });
};

const amount = 10;
saveAsCSV(amount);
