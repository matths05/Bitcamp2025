import requests

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    + "AppleWebKit/537.36 (KHTML, like Gecko) "
    + "Chrome/122.0.0.0 Safari/537.36"
}


response = requests.get(
    "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=TSLA&apikey=aaa",
    headers=headers,
)
print(response.json())
