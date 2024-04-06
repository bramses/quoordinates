import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import clipboard from "clipboardy";
import fs from "fs";
import { similaritySearch } from "./similarity-search.js";
import { exec } from "child_process";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

const openai = new OpenAIApi(configuration);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

const readFromClipboard = async () => {
  return clipboard.readSync();
};

const writeToFile = async (data) => {
  // write to alfred-searches/{date}.md
  const date = new Date();
  const filename = `alfred-searches/${date.toISOString()}.md`;
  fs.writeFileSync(filename, data);
  return filename;
};

const openTextEditor = async (filename) => {
  // open -a typora filename.md
  const command = `open -a typora ${filename}`;
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve();
    });
  });
};

const main = async () => {
  // Get the text from the clipboard
  const queryPromise = await readFromClipboard();
  const query = queryPromise.toString().trim();
  console.log(`Query: ${query}`);
  // Search for similar quotes
  const similar = await similaritySearch(query);

  let results = `Query = ${query}:\n\n---\n\n`;

  for (const quote of similar) {
    const contextPrompt = `I only have the following quote, recreate outside context using concepts from the world. Do a breadth first search of external data. This means that you are **not rephrasing the content in the quote**. You are pulling in examples and information from the world **outside the set** of the quote. Do not bother repeating or rehashing the quote.\n\nQuote:\n${quote.text}\n-- ${quote.title} by ${quote.author}\n\nContext:\n`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: contextPrompt,
        },
      ],
    });

    const context = completion.data.choices[0].message.content;

    results += `Title: ${quote.title}\n\nAuthor: ${quote.author}\n\nQuote:\n\n> ${quote.text}\n\nContext:\n\n${context}\n\n---\n\n`;
  }

  console.log(results);
  const filename = await writeToFile(results);
  await openTextEditor(filename);
};

if (process.env.DEV) {
  main();
}
