from dotenv import load_dotenv
import os
import json
from supabase import create_client, Client
load_dotenv()


url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)
amazon_tag= os.environ.get("AMAZON_TAG")


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

all_books = fetch_all_records('books')
print(len(all_books))
print(all_books[0])

manual_add = []
working_links = []


# create link in style https://www.amazon.com/dp/B08FHHQRM2?tag=bramses-20
# test on book 0
# asin = all_books[0]['asin']
# title = all_books[0]['title']
# link = f"https://www.amazon.com/dp/{asin}/?ref=nosim?tag={amazon_tag}"
# print(link)

# test link for 404 and if so add it to a list of books to manually add
import requests
# r = requests.get(link)
# print(r.status_code)
# if r.status_code == 404:
#     manual_add.append(title)

# loop through all books and create links
for book in all_books:
    asin = book['asin']
    title = book['title']
    link = f"https://www.amazon.com/dp/{asin}/?ref=nosim?tag={amazon_tag}"

    working_links.append({
        "title": title,
        "link": link,
        "asin": asin,
        "author": book['author'],
        "book_id": book['book_id'],
    })

# write both lists to json file { "manual_add": [], "working_links": [] }
with open('amazon_links.json', 'w') as f:
    json.dump({"manual_add": manual_add, "working_links": working_links}, f, indent=4)

