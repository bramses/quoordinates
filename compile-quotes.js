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
import * as math from "mathjs";
import { kmeans } from "ml-kmeans";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

const openai = new OpenAIApi(configuration);

dotenv.config();

const CLUSTER_THRESHOLD = 0.78;
const BOOK_ID = "38531384";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// Define the k-means clustering algorithm
function kMeansLocal(data, k) {
  // Initialize the centroids
  const centroids = [];
  let prevCentroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(data[Math.floor(Math.random() * data.length)]);
  }

  // Assign each data point to the closest centroid
  const assignments = [];
  for (let i = 0; i < data.length; i++) {
    const distances = [];
    for (let j = 0; j < centroids.length; j++) {
      distances.push(math.distance(data[i], centroids[j]));
    }
    assignments.push(distances.indexOf(Math.min(...distances)));
  }

  // Update the centroids
  for (let i = 0; i < k; i++) {
    const cluster = data.filter((d, j) => assignments[j] === i);
    if (cluster.length === 0) {
      continue;
    }
    centroids[i] = math.mean(cluster, 0);
  }

  // Repeat until the centroids no longer change
  if (!math.deepEqual(centroids, prevCentroids)) {
    prevCentroids = centroids;
    return kMeans(data, k);
  }

  // Return the assignments
  return assignments;
}

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

function clusterEmbeddings(quotes, threshold = 0.01) {
  let clusters = [];
  let clusterIndex = 0;
  let similarityAvg = 0;
  let total = 0;

  quotes.forEach((quote, index) => {
    if (quote.cluster === undefined) {
      quote.cluster = clusterIndex;
      clusters[clusterIndex] = [quote];

      quotes.forEach((otherQuote, otherIndex) => {
        const quoteEmbedding = JSON.parse(quote.embedding);
        const otherQuoteEmbedding = JSON.parse(otherQuote.embedding);

        if (index === otherIndex) return;
        const _similarity = similarity(quoteEmbedding, otherQuoteEmbedding);
        if (otherQuote.cluster === undefined) {
          if (_similarity > threshold) {
            otherQuote.cluster = clusterIndex;
            clusters[clusterIndex].push(otherQuote);
          }
        }

        total++;
        similarityAvg += _similarity;
      });

      clusterIndex++;
    }
  });

  console.log("Average similarity: " + similarityAvg / total);

  return clusters;
}

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

  // let clusteredQuotes = clusterEmbeddings(quotes, CLUSTER_THRESHOLD);

  // Example usage
  //   const data = [
  //     [1, 2],
  //     [3, 4],
  //     [5, 6],
  //     [7, 8],
  //   ];
  const k = 5;
  const assignments = kmeans(
    quotes
      .map((quote) => JSON.parse(quote.embedding))
      .filter((quote) => quote.length === 1536),
    k
  );

  // console.log(assignments);

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
      cluster.forEach((quote) => {
        markdown += `- ${quote.text}\n`;
      });
      markdown += `\n\n`;
      // markdown += `### Follow Up Questions\n\n${followUp}\n\n`;
    }

      fs.writeFileSync("output.md", markdown);
};

// main();
