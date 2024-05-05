/*
compile all quotes from supabase where BookID = X.
Then use GPT to cluster them into a few categories.
Then create a easy to read story about highlights.
*/

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import similarity from "compute-cosine-similarity";
import { Configuration, OpenAIApi } from "openai";
import { kmeans } from "ml-kmeans";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

const openai = new OpenAIApi(configuration);

dotenv.config();

const BOOK_ID = "1474870";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});


const getBookIDFromTitle = async (title) => {
  const { data, error } = await supabase
    .from("books")
    .select("book_id")
    .ilike("title", "%" + title + "%");

  if (error) {
    console.error(error);
    return null;
  }

  // if undefined, return null
  if (data.length === 0) {
    return null;
  }

  return data[0].book_id;
};

const compileQuotesFromTitle = async (bookTitle) => {
  const bookId = await getBookIDFromTitle(bookTitle);
  if (!bookId) {
    console.error("Book not found.");
    return [];
  }

  const quotes = await getQuotes(bookId);
  return quotes;
};

const compileQuotesFomID = async (bookID) => {
  const quotes = await getQuotes(bookID);
  return quotes;
};

const getQuotes = async (bookId) => {
  const { data, error } = await supabase
    .from("highlights")
    .select("*")
    .eq("book_id", bookId);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};

const assignTopicToCluster = async (cluster) => {
  try {
    const prompt = `Given the following quotes, what is a good topic for them? Return only the topic as a Markdown heading with no leading #. No bold (**) or italics (*) are needed.`;

    const completion = await openai.createChatCompletion({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: cluster.map((quote) => quote.text).join("\n"),
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const content = completion.data.choices[0].message.content;

    return content.trim().replace(/#/, "");
  } catch (err) {
    console.log("START ERROR");
    console.error(err);
    console.error(err.response);
    console.error(err.response.data);
    console.error(err.response.data.error);
    console.error(err.response.data.error.message);
    console.error(err.response.data.error.code);
    console.error(err.response.data.error.status);
    console.error(err.response.data.error.request);
    console.log("END ERROR");
    throw err;
  }
};

const highlightQuote = async (quote, topic) => {
  console.log(`Highlighting quote: ${quote} for topic: ${topic}`);
  try {
    const prompt = `Given the following quote, highlight the part related to the topic using ** (MD bold). Return the quote with the relevant part highlighted. Say nothing else. Do not include the topic in the response.`;

    const completion = await openai.createChatCompletion({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `Quote: <start>${quote}<end>\n\nTopic: ${topic}\n\nHighlighted Quote (Verbatim):`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const content = completion.data.choices[0].message.content;

    console.log(content);

    return content.trim();
  } catch (err) {
    console.log("START ERROR");
    console.error(err);
    console.error(err.response);
    console.error(err.response.data);
    console.error(err.response.data.error);
    console.error(err.response.data.error.message);
    console.error(err.response.data.error.code);
    console.error(err.response.data.error.status);
    console.error(err.response.data.error.request);
    console.log("END ERROR");
    throw err;
  }
}


const summarizeCluster = async (cluster) => {
  try {
    const prompt = `Given the following quotes, summarize them into a two-three sentence summary. Return only the summary`;

    const completion = await openai.createChatCompletion({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: cluster.map((quote) => quote.text).join("\n"),
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const content = completion.data.choices[0].message.content;

    return content.trim();
  } catch (err) {
    console.log("START ERROR");
    console.error(err);
    console.error(err.response);
    console.error(err.response.data);
    console.error(err.response.data.error);
    console.error(err.response.data.error.message);
    console.error(err.response.data.error.code);
    console.error(err.response.data.error.status);
    console.error(err.response.data.error.request);
    console.log("END ERROR");
    throw err;
  }
};

const followUpQuestions = async (cluster) => {
  try {
    const prompt = `Given the following quotes, what are some follow up questions you could ask about them? Return only the questions as a bulleted list`;

    const completion = await openai.createChatCompletion({
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: cluster.map((quote) => quote.text).join("\n"),
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const content = completion.data.choices[0].message.content;

    return content.trim();
  } catch (err) {
    console.log("START ERROR");
    console.error(err);
    console.error(err.response);
    console.error(err.response.data);
    console.error(err.response.data.error);
    console.error(err.response.data.error.message);
    console.error(err.response.data.error.code);
    console.error(err.response.data.error.status);
    console.error(err.response.data.error.request);
    console.log("END ERROR");
    throw err;
  }
};

const main = async () => {
  const quotes = await compileQuotesFomID(BOOK_ID);

  console.log(quotes.length + " quotes found.");

  // w want roughly 5-10 quotes per cluster
  const k = Math.ceil(quotes.length / 5);
  const assignments = kmeans(
    quotes
      .map((quote) => JSON.parse(quote.embedding))
      .filter((embedding) => embedding.length === 1536),
    k
  );


  // convert each cluster into a heading and a list of quotes in markdown under it and write to a file
  // use cluster index as heading
  // each quote is a bullet point under the heading
  let markdown = "";

  const clusters = [];
  for (let i = 0; i < k; i++) {
    clusters.push([]);
  }
  for (let i = 0; i < assignments.clusters.length; i++) {
    clusters[assignments.clusters[i]].push(quotes[i]);
  }

    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      console.log(`Cluster ${i} has ${cluster.length} quotes.`);
      const topic = await assignTopicToCluster(cluster);
      const summary = await summarizeCluster(cluster);
      // const followUp = await followUpQuestions(cluster);

      markdown += `## ${topic}\n\n`;
      markdown += `### Summary\n\n${summary}\n\n`;
      markdown += `### Quotes\n\n`;
      // // add each quote to the markdown with highlighting
      // for (const quote of cluster) {
      //   markdown += `- ${await highlightQuote(quote.text, topic)}\n`;
      // }
      // markdown += `\n\n`;
      // add each quote to the markdown without highlighting
      for (const quote of cluster) {
        markdown += `- ${quote.text}\n`;
      }
      markdown += `\n\n`;
      // markdown += `### Follow Up Questions\n\n${followUp}\n\n`;
    }

      fs.writeFileSync("output.md", markdown);
};

// if env var DEV exists, run main
if (process.env.DEV) {
  main();
}
