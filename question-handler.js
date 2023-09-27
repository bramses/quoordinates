import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

console.log("org: " + process.env.OPENAI_ORG);
const openai = new OpenAIApi(configuration);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// get the first row of the highlights table and use the api to generate a question and add it to the row as the question column
const generateQuestion = async (row) => {
  try {
    const highlight = row.text;

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

const addQuestionToHighlight = async (row, question) => {
  try {

    const res = await supabase
      .from("highlights")
      .update({ question })
      .match({ id: row.id });
  } catch (err) {
    console.log("Error adding question to highlight");
    console.error(err);
    throw err;
  }
};

const filter_start_at_page = (records, start_at_id) => {
  if (!start_at_id) {
    return records;
  }

  // get anything in array after the start_at_id it should be in one of the pages [][]
  let found = false;
  let pageNumber = 0;
  for (const page of records) {
    for (const row of page) {
      if (row.id === start_at_id) {
        found = true;
        console.log("found start at id: " + start_at_id + " at page: " + pageNumber);
      }
      if (found) {
        break;
      }
    }

    pageNumber++;
  }

  return pageNumber;

};


const fetchAllRecords = async (table_name, page_size = 1000) => {
  const all_records = [];
  let current_page = 0;

  while (true) {
    const response = await supabase
      .from(table_name)
      .select("*")
      // where question column is null
      .is("question", null)
      .range(current_page * page_size, (current_page + 1) * page_size - 1);

    const records = response.data;

    if (!records || records.length === 0) {
      break;
    }

    // remove the embedding column
    for (const record of records) {
      delete record.embedding;
    }

    if (records && records.length > 0) {
      all_records.push(records);
      current_page += 1;
      console.log("current page: " + current_page);
    } else {
      break;
    }
  }

  await saveRecordsToFile(all_records);

  return all_records;
};

(async () => {
  try {

    const justSave = false;

    // check for records.json file
    let res = await fetchAllRecords("highlights");
    // const filePath = path.join(__dirname, "records.json");
    // if (fs.existsSync(filePath)) {
    //   const file = fs.readFileSync(filePath);
    //   res = JSON.parse(file);
    // } else {
    //   res = await fetchAllRecords("highlights");
    // }
    console.log("collected len: " + res.length * res[0].length);

    if(!justSave) {
      let count = 0;



      // filter res to only include pages after pageNum
      // res = res.slice(pageNum - 1);
  
      // // iterate over all highlights and generate a question for each one
      for (const page of res) {
        console.log("page: " + count++);
        for (const row of page) {
          if (row.question && row.question.length > 0) {
            console.log(
              "SKIPPING row with question: " +
                row.question +
                " || " +
                row.text +
                " || " +
                row.id
            );
            continue;
          } else {
            const question = await generateQuestion(row);
            await addQuestionToHighlight(row, question);
            console.log(question + " || " + row.text + " || " + row.id);
            // wait 1 second between each request
            // await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }

      // ...

      // for (let pageIndex = res.length - 1; pageIndex >= 0; pageIndex--) {
      //   console.log("page: " + pageIndex);
      //   const page = res[pageIndex];
      //   for (let rowIndex = page.length - 1; rowIndex >= 0; rowIndex--) {
      //     const row = page[rowIndex];
      //     if (row.question && row.question.length > 0) {
      //       console.log(
      //         "SKIPPING row with question: " +
      //           row.question +
      //           " || " +
      //           row.text +
      //           " || " +
      //           row.id
      //       );
      //       continue;
      //     } else {
      //       const question = await generateQuestion(row);
      //       await addQuestionToHighlight(row, question);
      //       console.log(question + " || " + row.text + " || " + row.id);
      //       // wait 1 second between each request
      //     }
      //   }
      // }
    }

    // ...

    // for (const row of data) {
    //   if (row.question) {
    //     console.log("skipping row with question: " + row.question + " || " + row.text + " || " + row.id);
    //     continue;
    //   }
    //   const question = await generateQuestion(row);
    //   await addQuestionToHighlight(row, question);
    //   console.log(question + " || " + row.text + " || " + row.id);
    // }

    // const row = data[0];
    // const question = await generateQuestion(row);
    // await addQuestionToHighlight(row, question);
    // console.log(question + " || " + row.text + " || " + row.id);
  } catch (err) {
    console.log("Error generating question");
    console.error(err);
  }
})();



const saveRecordsToFile = async (records) => {
  const filePath = path.join(__dirname, "records.json");
  fs.writeFileSync(filePath, JSON.stringify(records));
};
