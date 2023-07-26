import requests
import json
import os
import datetime
from dotenv import load_dotenv
load_dotenv()



# Get the token from the .env file
READWISE_ACCESS_TOKEN = os.getenv("READWISE_ACCESS_TOKEN")


def check_token():
    # set the headers
    headers = {
        "Authorization": "Token " + READWISE_ACCESS_TOKEN
    }

    # make the GET request
    response = requests.get("https://readwise.io/api/v2/auth/", headers=headers)

    if response.status_code == 204:
        print("Token is valid")
        return True
    else:
        print("Token is invalid")
        return False


def fetch_from_export_api(updated_after=None):
    full_data = []
    next_page_cursor = None
    while True:
        params = {}
        if next_page_cursor:
            params['pageCursor'] = next_page_cursor
        if updated_after:
            params['updatedAfter'] = updated_after
        print("Making export api request with params " + str(params) + "...")
        response = requests.get(
            url="https://readwise.io/api/v2/export/",
            params=params,
            headers={"Authorization": f"Token {READWISE_ACCESS_TOKEN}"}, verify=False
        )
        full_data.extend(response.json()['results'])
        next_page_cursor = response.json().get('nextPageCursor')
        if not next_page_cursor:
            break
    return full_data


def write_to_file(data):
    with open('data.json', 'w') as outfile:
        json.dump(data, outfile, indent=4)


def read_from_file():
    with open('data.json') as json_file:
        data = json.load(json_file)
    return data


def get_book_by_id(book_id):
    # https://readwise.io/api/v2/books/<book id>/
    response = requests.get(
        url=f"https://readwise.io/api/v2/books/{book_id}/",
        headers={"Authorization": f"Token {READWISE_ACCESS_TOKEN}"}, verify=False
    )

    return response.json()


def filter_highlights_by_book_id(highlights, book_id):
    return [highlight for highlight in highlights if highlight['book_id'] == book_id]


def filter_highlights_by_category(highlights, category):
    return [highlight for highlight in highlights if highlight['category'] == category]


def get_book_ids(highlights):
    return list(set([highlight['book_id'] for highlight in highlights]))


# Get all of a user's books/highlights from all time (last fetch in resources.md)
# all_data = fetch_from_export_api()
# write_to_file(all_data) 

# Later, if you want to get new highlights updated since your last fetch of allData, do this.
last_fetch_was_at = datetime.datetime.now() - datetime.timedelta(days=1)  # use your own stored date
new_data = fetch_from_export_api(last_fetch_was_at.isoformat())
write_to_file(new_data)


# print(json.dumps(new_data, indent=4))
# print(get_book_by_id(30388241))