from nomic import atlas
from dotenv import load_dotenv
import os
import json
from supabase import create_client, Client
load_dotenv()
import numpy as np


url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def fetch_all_records(table_name, page_size=1000):
    all_records = []
    current_page = 0

    while True:
        response = supabase.table(table_name).select('*').range(current_page * page_size, (current_page + 1) * page_size - 1).execute()
        records = response.data

        if records:
            all_records.extend(records)
            current_page += 1
        else:
            break

    return all_records

# get highlights from supabase

all_highlights = fetch_all_records('highlights')
print(len(all_highlights))
print(all_highlights[0])

books_response = supabase.table('books').select('*').execute()

# remove the embedding column from each highlights_response in row and place in a list, and another list of data which is the rest of the row
embeddings = []
data = []


for row in all_highlights:
    # convert row['embedding'] from string to numpy array
    row['embedding'] = np.array(json.loads(row['embedding']))
    embeddings.append(row['embedding'])
    del row['embedding']
    # add book data to row
    for book in books_response.data:
        if book['book_id'] == row['book_id']:
            row['title'] = book['title']
            row['author'] = book['author']
            row['cover_image_url'] = book['cover_image_url']
            row['book_url'] = book['readwise_url']
            row['asin'] = book['asin']
            break

    data.append(row)

# convert embeddings to numpy array
embeddings = np.array(embeddings)


project = atlas.map_embeddings(embeddings=embeddings, data=data, name='highlights', description='Highlights from Readwise', reset_project_if_exists=True, colorable_fields=['book_id'], id_field='id')
print(project)