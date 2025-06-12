import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Define keywords in English and Nepali
KEYWORDS = ['talent hunt', 'job', 'jobs', 'opportunity', 'opportunities', 
            'प्रतिभा', 'रोजगार', 'अवसर', 'प्रतियोगिता']

# Today's date in English (e.g. '12 June') and Nepali (e.g. '१२ जून')
today = datetime.now()
today_english = today.strftime('%d %B')  # '12 June'
# For Nepali date, you might need a mapping or a library - simplified here:
today_nepali = '१२ जून'  # You should map this properly for your use case

def contains_today_date(text):
    return (today_english in text) or (today_nepali in text)

def contains_keywords(text):
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in KEYWORDS)

def scrape_site(url, article_selector, title_selector, date_selector, date_attr=None):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    articles = []

    for article in soup.select(article_selector):
        title_elem = article.select_one(title_selector)
        date_elem = article.select_one(date_selector)

        if not title_elem or not date_elem:
            continue

        title = title_elem.text.strip()
        if date_attr:
            date_str = date_elem.get(date_attr, '')
        else:
            date_str = date_elem.text.strip()

        # Filter for today only
        if not contains_today_date(date_str):
            continue

        # Filter for keywords
        if not contains_keywords(title):
            continue

        # Optional: get article link if available
        link = None
        if title_elem.has_attr('href'):
            link = title_elem['href']
        elif title_elem.find('a') and title_elem.find('a').has_attr('href'):
            link = title_elem.find('a')['href']

        articles.append({
            'title': title,
            'date': date_str,
            'link': link
        })

    return articles

if __name__ == "__main__":
    all_articles = []

    # Example: Scrape Kantipur news site (English/Nepali mixed)
    kantipur_url = 'https://ekantipur.com'
    kantipur_articles = scrape_site(
        url=kantipur_url,
        article_selector='.main-story, .news-list li',    # example selectors - update per site
        title_selector='h2 a',
        date_selector='.date',  # adjust per site
        date_attr=None
    )
    all_articles.extend(kantipur_articles)

    # Add more sites here similarly...

    # Print all filtered articles from all sites
    for idx, article in enumerate(all_articles, 1):
        print(f"{idx}. {article['title']}")
        print(f"Date: {article['date']}")
        if article['link']:
            print(f"Link: {article['link']}")
        print()
