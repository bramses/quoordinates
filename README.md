# Quoordinates (Quote Coordinates)

- Readwise
- OpenAI Embeddings
- Nomic
- PSQL (PostgreSQL)

1. fetch highlights from readwise
    1. (optional) start at date
2. upsert data in database
3. embed highlights with openai
4. place embeddings into nomic visualization

`embed-into-supabase.js` is a node script that embeds highlights into supabase
`nomic-viz.py` is a python script that visualizes highlights in nomic
`readwise-highlights.py` is a python script that fetches highlights from readwise

## Setup

1. Create a `.env` file with the following variables:

```
READWISE_ACCESS_TOKEN=
SUPABASE_URL=
SUPABASE_KEY=
OPENAI_API_KEY=
```

2. Install dependencies

```
poetry init
poetry shell
poetry install
```

and

```
npm install
```

3. Run the script to get readwise highlights

```
python readwise-highlights.py
```

4. Run the script to embed highlights

```
node embed-into-supabase.js
```

5. Run the script to visualize highlights

```
python nomic-viz.py
```