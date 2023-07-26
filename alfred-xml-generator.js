
import dotenv from 'dotenv'
import xml2js from 'xml2js'
import { similaritySearch } from './similarity-search.js'

dotenv.config()


/*

convert the similarity search results to alfred format

echo "<?xml version='1.0'?><items>"
"<item uid='$project' arg='$project$unicode_split' query='$query' valid='YES'><title>$project</title><subtitle>Append to Resources.md in this project</subtitle></item>"
echo "</items>"
*/

// const convertToAlfred = async (query) => {
//     let idIndex = 0
//     const results = await similaritySearch(query)
//     const sortedResults = results.sort((a, b) => b.similarity - a.similarity)
//     console.log("<?xml version='1.0'?><items>")
//     for (const result of sortedResults) {
//         console.log(`<item uid='${idIndex}' arg='${result.text}' query='${query}' valid='YES'><title>${result.text}</title><subtitle>${result.title} - ${result.similarity}</subtitle></item>`)
//         idIndex++
//     }
//     console.log("</items>")
// }


const convertToAlfred = async (query) => {
    let idIndex = 0;
    const results = await similaritySearch(query);
    const sortedResults = results.sort((a, b) => b.similarity - a.similarity);

    const items = sortedResults.map(result => ({
        '$': {
            uid: idIndex++,
            arg: result.text,
            query: query,
            valid: 'YES',
        },
        title: [result.text],
        subtitle: [`${result.title} - ${result.similarity}`]
    }));

    const builder = new xml2js.Builder();
    const xml = builder.buildObject({ items: { item: items } });

    console.log(xml);
}

// run semantic search on terminal arg (include spaces) and remove the ? at the end
convertToAlfred(process.argv.slice(2).join(" ").replace("?", ""))

// async anonomous function
// (async () => {
//     const s = await similaritySearch(process.argv.slice(2).join(" ").replace("?", ""))
//     console.log(s)
// })()