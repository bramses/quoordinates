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

# get highlights from supabase

highlights_response = supabase.table('highlights').select('*').execute()
books_response = supabase.table('books').select('*').execute()

# remove the embedding column from each highlights_response in row and place in a list, and another list of data which is the rest of the row
embeddings = []
data = []


for row in highlights_response.data:
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
    # print(row)
    data.append(row)

# convert embeddings to numpy array
embeddings = np.array(embeddings)


project = atlas.map_embeddings(embeddings=embeddings, data=data, name='highlights', description='Highlights from Readwise', reset_project_if_exists=True, colorable_fields=['book_id', 'title', 'author', 'asin'])
print(project)