
import dotenv from 'dotenv'
import xml2js from 'xml2js'
import { similaritySearch } from './similarity-search.js'
import fs from 'fs'

dotenv.config()


/*

convert the similarity search results to alfred format

echo "<?xml version='1.0'?><items>"
"<item uid='$project' arg='$project$unicode_split' query='$query' valid='YES'><title>$project</title><subtitle>Append to Resources.md in this project</subtitle></item>"
echo "</items>"
*/


const convertToAlfred = async (query) => {
    try {
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
    
        console.log(xml); // alfred will read this from stdout

        return results
    } catch (err) {
        return err
    }
}

const writeToLogFile = (query, results) => {
    // capture json of query and results in log file
    const logPath = process.env.LOG_PATH

    const log = {
        query,
        timestamp: new Date(),
        results
    }

    // get existing log
    const existingLog = fs.existsSync(logPath) ? fs.readFileSync(logPath) : ""




    fs.writeFileSync(logPath, existingLog + "\n\n" + "```json\n" + JSON.stringify(log, null, 2) + "\n```")
}




(async () => {
    // run semantic search on terminal arg (include spaces) and remove the ? at the end
    const query = process.argv.slice(2).join(" ").replace("?", "")
    const results = await convertToAlfred(query)
    writeToLogFile(query, results)
})()



