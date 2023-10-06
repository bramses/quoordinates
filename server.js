import express from 'express';
import bodyParser from 'body-parser';
import { similaritySearch } from './similarity-search.js';
import { sharePic } from './share-pic.js';
import { fetchRandomHighlight } from './get-random-highlight.js';


const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {

    res.send([
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
      ])
})

app.post('/search', async (req, res) => {
    console.log(req.body)
    const query = req.body.query
    const results = await similaritySearch(query)
    res.send(results)
})

app.post('/share', async (req, res) => {
    // console.log(req.body)
    const url = req.body.url
    const text = req.body.text
    const result = await sharePic(url, text)

    if (result.error) {
        res.status(500).send({
            error: result.error
        })
        return
    }

    res.send({
      result
    })
})

app.post('/random', async (req, res) => {
    let amount = 1
    if (req.body.amount)
        amount = req.body.amount
    const result = await fetchRandomHighlight(amount)
    res.send(result)
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
})