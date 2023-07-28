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
OPENAI_ORG=
DAY_LAST_FETCHED=
LOG_PATH=
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

## Images

![Screenshot 2023-07-26 01-46-45](https://github.com/bramses/quoordinates/assets/3282661/b618e3ce-f66b-41a7-ba9d-03b5ef1bd65c)
![Screenshot 2023-07-26 01-35-19](https://github.com/bramses/quoordinates/assets/3282661/039fc137-7054-4c28-9f2c-39fb4a4c8d2f)
![Screenshot 2023-07-26 01-35-27](https://github.com/bramses/quoordinates/assets/3282661/efb78a06-1116-4b41-b4c5-e6f1eee6c90d)

![Screenshot 2023-07-28 15-11-18](https://github.com/bramses/quoordinates/assets/3282661/d66e95c1-22a9-42f3-a440-8ba4a926c995)
![Screenshot 2023-07-28 15-10-35](https://github.com/bramses/quoordinates/assets/3282661/7e32262d-7705-4cc7-b770-9c3bc0444865)

