import yfinance as yf
from newsapi import NewsApiClient

# Get historical stock data
ticker = "AAPL"
stock = yf.Ticker(ticker)
historical_data = stock.history(period="5y")
print(f"Historical Stock Data for {ticker}:")
print(len(historical_data))

# Get recent stock news
api_key = "YOUR_NEWSAPI_KEY"
newsapi = NewsApiClient(api_key=api_key)
company_name = "Apple"
news = newsapi.get_everything(q=company_name, language="en", sort_by="publishedAt")

print(f"\nRecent News for {company_name}:")
for article in news['articles']:
    print(f"Title: {article['title']}")
    print(f"Source: {article['source']['name']}")
    print(f"Published: {article['publishedAt']}")
    print(f"URL: {article['url']}")
    print("-" * 80)