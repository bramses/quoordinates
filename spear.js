import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import { similaritySearch } from "./similarity-search.js";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

const openai = new OpenAIApi(configuration);

const fiveWhysPrompt = (query) =>
  `Given the query: "${query}", generate five whys into the query. Five deeper questions that use the former questions, basically. I only need the questions, not the answers.`;
const isRelevantPromptExplain = (query, text) =>
  `Given the query: "${query}", is the following text relevant? "${text}". Yes or no? Explain why.`;
const isRelevantPrompt = (query, text) =>
  `Given the query: "${query}", is the following text relevant? "${text}". Yes or no? Only answer yes if the text is relevant to the query. If the text is not relevant, answer no.`;
const stitchResultsPrompt = (query, results) =>
  `You are a PHD student (so your knowledge is very good, and you have a great grasp on grammar and understanding relationships between concepts) tasked with the following: Using the following quotes understand their meaning and link them together into a one paragraph coherent summary. Re-arrange them in any way that makes the most coherent point from all of them combined, telling a story of sorts, just explain the logic that connects them: ${results.join(
    " "
  )}. Remember you do not have to use the quotes in the order they were given and might be better switching them around. Here is the query to frame your answer around: "${query}". Make sure to think it out and read each quote carefully.`;

const getCompletion = async (prompt, maxTokens = 64) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  return completion.data.choices[0].message.content;
};

const spear = async (query) => {
  console.log(`Running query: ${query}`);
  const prompt = fiveWhysPrompt(query);
  const completion = await getCompletion(prompt);
  const queries = completion
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.slice(2).trim());
  console.log(queries);
  // Promise.all similaritySearch for each query
  const results = await Promise.all(
    queries.map(async (query) => ({
      query,
      results: await similaritySearch(query),
    }))
  );

  let setOfQuotes = new Set();
  const topResults = results.map((result) => {
    let topResult = result.results[0];
    if (setOfQuotes.has(topResult.text)) {
      topResult = result.results[1];
    }
    if (setOfQuotes.has(topResult.text)) {
      topResult = result.results[2];
    }
    if (setOfQuotes.has(topResult.text)) {
      return "";
    }

    setOfQuotes.add(topResult.text);
    return `> ${topResult.text}\n\n--<cite>${topResult.title}</cite>\n\n`;
  });

  const filterResultsByRelevance = async (queries, results) => {
    const filteredResults = [];
    for (let i = 0; i < results.length; i++) {
      const prompt = isRelevantPrompt(queries[i], results[i]);
      const completion = await getCompletion(prompt);
      if (completion.toLowerCase() === "yes") {
        filteredResults.push(results[i]);
      }
    }
    return filteredResults;
  };
  const filteredResults = await filterResultsByRelevance(queries, topResults);
  console.log(filteredResults);
  console.log(filteredResults.length);
  if (filteredResults.length < 1) {
    console.log("Not enough results to stitch together.");
    return;
  }
  const stitchedResults = await getCompletion(
    stitchResultsPrompt(query, filteredResults)
  );
  console.log(stitchedResults);
};

const main = async () => {
  const query = process.argv.slice(2).join(" ");
  await spear(query);
};

main();
