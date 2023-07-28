import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG,
});

const openai = new OpenAIApi(configuration);

const similaritiesAndDifferences = async (quotes) => {
  const prompt =
    "What are the similarities and differences between the following quotes?";

  const quoteTexts = quotes.map((quote) => quote.text);


  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: prompt}, ...quoteTexts.map((question, idx) => ({role: "user", content: `Quote #${idx + 1}: ` + question}))],
  });
  
  // console.log(completion.data.choices[0].message.content);

  return completion.data.choices[0].message.content
};

const explainQuoteRelationshipToQuery = async (quote, query) => {
    const prompt = `Explain the relationship between the following quote and the query: "${query}"\n\nQuote: "${quote}"\n\nRelationship:`;
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: prompt}],
    });

    // console.log(completion.data.choices[0].message.content);

    return completion.data.choices[0].message.content
}

const applyQueryThroughTheLensOfQuote = async (quote, query) => {
    const prompt = `Apply the query "${query}" through the lens of the following quote:\n\nQuote: "${quote}"\n\nAnswer:`;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: prompt}],
    });

    // console.log(completion.data.choices[0].message.content);

    return completion.data.choices[0].message.content
}

const quotes = [
    {
      text: 'the difference between having a vision and not having a vision is almost everything, and doing excellent work provides a goal which is steady in this world of constant change.',
      title: 'The Art of Doing Science and Engineering: Learning to Learn',
      similarity: 0.830734508262759
    },
    {
      text: '“Then let them know that we are here,” the man said, and from his staff and hands leapt forth a white radiance that broke as a sea-wave breaks in sunlight, against the thousand diamonds of the roof and walls: a glory of light, through which the two fled, straight across the great cavern, their shadows racing from them into the white traceries and the glittering crevices and the empty, open grave.',
      title: 'The Tombs of Atuan (The Earthsea Cycle Series Book 2)',
      similarity: 0.828927323391277
    },
    {
      text: 'there are few things more valuable than someone who consistently produces valuable output, and few approaches to work more satisfying than being given the room to focus on things that really matter.',
      title: 'A World Without Email: Reimagining Work in an Age of Communication Overload',
      similarity: 0.827891369270293
    }
  ]

// similaritiesAndDifferences(quotes)
// explainQuoteRelationshipToQuery(quotes[0].text, "what is the difference between a vision and no vision?")
// applyQueryThroughTheLensOfQuote(quotes[2].text, "Unlike lying, an imagined reality is something that everyone believes in, and as long as this communal belief persists, the imagined reality exerts force in the world.")

async function main() {
    // promise all for applyQueryThroughTheLensOfQuote run same time
    const results = await Promise.all(quotes.map(quote => applyQueryThroughTheLensOfQuote(quote.text, "Unlike lying, an imagined reality is something that everyone believes in, and as long as this communal belief persists, the imagined reality exerts force in the world.")))
    console.log(results.map((result, idx) => `Quote:\n\n>${quotes[idx].text}\n\n${result}`).join("\n\n---\n\n"))

    /**
     * EXAMPLE OUTPUT for "Unlike lying, an imagined reality is something that everyone believes in, and as long as this communal belief persists, the imagined reality exerts force in the world."
     * 
     * Quote:

>the difference between having a vision and not having a vision is almost everything, and doing excellent work provides a goal which is steady in this world of constant change.

The quote emphasizes the significance of having a vision and doing excellent work in a constantly changing world. Drawing upon the query, we can interpret this in the context of imagined reality. Just as having a vision sets a clear goal and gives direction, the communal belief in an imagined reality provides a shared understanding and exerts a force in the world. Both having a vision and a communal belief in an imagined reality contribute to stability amidst constant change.

---

Quote:

>“Then let them know that we are here,” the man said, and from his staff and hands leapt forth a white radiance that broke as a sea-wave breaks in sunlight, against the thousand diamonds of the roof and walls: a glory of light, through which the two fled, straight across the great cavern, their shadows racing from them into the white traceries and the glittering crevices and the empty, open grave.

In the given quote, the man is creating an imagined reality by using his staff and hands to emit a radiant white light. This imagined reality is something that he believes in and he is able to manifest it in the physical world, as evidenced by the light breaking against the diamonds, walls, and roof of the cavern. The communal belief in this imagined reality is shown by the two individuals fleeing across the cavern, with their shadows racing from them into the white traceries and crevices. As long as this communal belief persists, the imagined reality of the radiant light exerts force in the world, transforming the environment and creating a sense of awe and wonder.

---

Quote:

>there are few things more valuable than someone who consistently produces valuable output, and few approaches to work more satisfying than being given the room to focus on things that really matter.

Applying the query to the given quote, we can interpret it as follows:

Similar to lying, an imagined reality is something that everyone believes in. In the quote, the "room to focus on things that really matter" represents the imagined reality. This imagined reality is created by the belief that there are few things more valuable than someone who consistently produces valuable output. As long as this communal belief persists, the imagined reality exerts force in the world and informs the satisfaction derived from the approach to work.
     * 
     */
}

// main()