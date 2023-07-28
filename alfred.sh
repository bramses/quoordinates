#!/bin/bash

user_input="$1"

if [[ $user_input == *'?' ]]; then
    cd {YOUR_PATH}/quoordinates/
    RAW_XML=$({YOUR_NODE_PATH}/node embed-into-supabase.js "$user_input")

    # Clean XML with lxml
    XML=$(echo "$RAW_XML" | python3 -c "import sys; from lxml import etree; parser = etree.XMLParser(recover=True); tree = etree.parse(sys.stdin, parser=parser); print(etree.tostring(tree).decode('utf-8'))")
    echo "$XML"

    MARKDOWN_FILE={YOUR_LOG_FILE_PATH}

    RESULTS=$(
        python3 - <<EOF
import lxml.etree as ET
import html
import traceback

try:
    query = '''$user_input'''

    # Parse XML with recovery mode
    parser = ET.XMLParser(recover=True)
    root = ET.fromstring('''$XML''', parser=parser)
    items = root.findall('item')

    # Extract data
    data = []
    for item in items:
        title_element = item.find('title')
        subtitle_element = item.find('subtitle')
        # Skip this item if it doesn't have both a title and a subtitle
        if title_element is None or subtitle_element is None:
            continue
        text = html.escape(title_element.text)
        title, similarity_str = html.escape(subtitle_element.text).rsplit(" - ", 1)
        similarity = float(similarity_str)
        data.append((text, title, similarity))

    # Sort by similarity
    data.sort(key=lambda x: x[2], reverse=True)

    # Format output
    results = [f"## {query}\\n\\n"]
    for text, title, similarity in data[:3]:  # Top 3
        text = html.unescape(text)
        title = html.unescape(title)
        result = f"> {text}\\n> -- <cite>{title}</cite>\\n\\nsimilarity = {similarity}\\n\\n---\\n"
        results.append(result)

    # Format output
    # results = [f"## {query}\\n\\n"]
    # for text, title, similarity in data[:3]:  # Top 3
        # result = f"> {text}\\n> -- <cite>{title}</cite>\\n\\nsimilarity = {similarity}\\n\\n---\\n"
        # results.append(result)

    # Convert list of results to a single string
    RESULTS = "\\n".join(results)

    print(RESULTS)

except Exception as e:
    print(f"An error occurred: {str(e)}")
    traceback.print_exc()
EOF
    )

    echo "$RESULTS" >>"$MARKDOWN_FILE"

fi
