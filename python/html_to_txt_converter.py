import os
from bs4 import BeautifulSoup

def read_html_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print("Error: Could not find", filename)
        print("Current working directory:", os.getcwd())
        print("Looking for file at:", filename)
        return None

def extract_tables(html_content):
    if not html_content:
        return []
    
    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find all tables
    tables = soup.find_all('table')
    print(f"Found {len(tables)} tables")
    return tables

def clean_text(text):
    # Split by whitespace and join with single space
    return ' '.join(text.split())

def is_correct_answer(row):
    # Check if row contains a span with green background
    span = row.find('span', style=lambda x: x and 'background-color: #0f0' in x)
    return span is not None

def extract_table_text(table):
    # Get all rows
    rows = table.find_all('tr')
    texts = []
    
    for row in rows:
        # Get text and clean it
        text = clean_text(row.get_text())
        
        # Handle question row
        if text.startswith('Kérdés:'):
            text = '| ' + text[8:].strip()  # Add pipe and remove "Kérdés:"
            texts.append(text)
        # Handle answer rows
        else:
            # Check if this is a correct answer
            if is_correct_answer(row):
                text = '*' + text
            texts.append(text)
    
    return texts

def write_to_file(tables, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        for table in tables:
            texts = extract_table_text(table)
            for text in texts:
                f.write(text + '\n')
            #f.write('\n')  # Add blank line between questions

def main():
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Construct the paths
    input_file = os.path.join(script_dir, "szt1.html")
    output_file = os.path.join(script_dir, "szt1.txt")
    
    # Read HTML file
    html_content = read_html_file(input_file)
    
    # Extract tables
    tables = extract_tables(html_content)
    
    # Write to file
    write_to_file(tables, output_file)
    print(f"\nOutput written to {output_file}")

if __name__ == "__main__":
    main()
