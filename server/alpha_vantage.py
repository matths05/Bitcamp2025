import requests
import argparse
import google.generativeai as genai
from typing import Dict, Any
import os
import json
from elevenlabs import ElevenLabs
from elevenlabs import save
from elevenlabs.types import VoiceSettings

# Replace with your own API keys

# Configure APIs
ALPHA_VANTAGE_API_KEY = "Y9TJW1DZ5R2VMHQS"
GEMINI_API_KEY = "AIzaSyAgdZ9Y27IkY6WSeKRfqSLXD-VN4MIyTVg"
ELEVENLABS_API_KEY = "sk_5ac49d3d0ea112d96969e82e65cd1367b2786946e4f49fd8"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")
client = ElevenLabs(api_key=ELEVENLABS_API_KEY)


# Get company overview (including description)


def get_company_overview(ticker: str, api_key: str) -> dict:
    url = "https://www.alphavantage.co/query"
    params = {"function": "OVERVIEW", "symbol": ticker, "apikey": api_key}

    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(f"Request failed with status code {response.status_code}")

    data = response.json()
    print(data)
    if not data or "Name" not in data:
        raise Exception(f"No company overview found for ticker '{ticker}'.")

    return data


def get_stock_news(ticker: str, api_key: str, limit: int = 3) -> list:
    """Get latest stock news for a given ticker."""
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "NEWS_SENTIMENT",
        "tickers": ticker,
        "apikey": api_key,
        "limit": limit,
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(f"Request failed with status code {response.status_code}")

    data = response.json()
    if not data or "feed" not in data:
        raise Exception(f"No news found for ticker '{ticker}'.")

    return data["feed"][:3]


def save_voice(text: str, filepath: str):
    """Generate and save voice from text using ElevenLabs."""

    audio = client.generate(
        text=text,
        voice="Playboi v3",
        model="eleven_multilingual_v2",
        voice_settings=VoiceSettings(
            stability=0.5, similarity_boost=0.9, style=0.4, use_speaker_boost=True
        ),
    )
    save(audio, filepath)


def analyze_news_with_gemini(article: dict, ticker) -> str:
    """Send individual news article to Gemini for analysis in Playboi Carti style."""
    sentiment = article.get("overall_sentiment_label", "N/A")

    prompt = f"""Imagine you are playboi carti.
    Analyze this news article and provide insights in carti voice:
    
    Headline: {article["title"]}
    Summary: {article["summary"]}
    Sentiment: {sentiment}
    
    Please provide a detailed analysis focusing on:
    1. The key points and implications of the news
    2. Your thoughts on the sentiment and what it means for the company
    3. How this news might affect the company: {ticker}'s future
    
    DO NOT USE MARKDOWN and DO NOT include ellipses for pauses and DO NOT use emojis to emphasize points. Also do not include
    carti's actions as part of your response. Be extra detailed about the sentiment and what it means for the company's vibe and AURA. Include Carti's signature catchphrases like slatt and bih and more. """

    response = model.generate_content(prompt)
    return response.text


def analyze_with_gemini(company_data: Dict[str, Any], news_data: list) -> str:
    """Send company data to Gemini for analysis."""
    news_summary = "\n".join(
        [
            f"Headline: {article['title']}\nSummary: {article['summary']}\n"
            for article in news_data
        ]
    )

    prompt = f"""Imagine you are playboi carti.
    Analyze this company data and provide insights in carti voice:
    
    Company Name: {company_data.get("Name", "N/A")}
    (Important be detailed) Description: {company_data.get("Description", "N/A")}
    Sector: {company_data.get("Sector", "N/A")}
    Industry: {company_data.get("Industry", "N/A")}
    Market Cap: {company_data.get("MarketCapitalization", "N/A")}
    P/E Ratio: {company_data.get("PERatio", "N/A")}
    Dividend Yield: {company_data.get("DividendYield", "N/A")}

    Latest News:
    {news_summary}
    
    Please provide a detailed analysis focusing on the company's position in its industry, key financial metrics, and recent news developments.
    DO NOT USE MARKDOWN and DO NOT include ellipses for pauses and DO NOT include emojis to emphasize points. Also do not include
    carti's actions as part of your response. Please be verbose and detailed in your analysis.Include Carti's signature catchphrases like slatt and bih and more."""

    response = model.generate_content(prompt)
    return response.text


def save_article_data(article: dict, filepath: str):
    """Save article data (title and banner image) as JSON."""
    article_data = {
        "title": article.get("title", ""),
        "banner_image": article.get("banner_image", ""),
        "url": article.get("url", ""),
        "time_published": article.get("time_published", ""),
    }

    with open(filepath, "w") as f:
        json.dump(article_data, f, indent=2)


def get_historical_data(ticker: str, api_key: str) -> dict:
    """Get historical stock data from Alpha Vantage."""
    url = "https://www.alphavantage.co/query"
    params = {"function": "TIME_SERIES_WEEKLY", "symbol": ticker, "apikey": api_key}

    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(f"Request failed with status code {response.status_code}")

    data = response.json()
    if not data or "Weekly Time Series" not in data:
        raise Exception(f"No historical data found for ticker '{ticker}'.")

    return data


def save_historical_data(data: dict, filepath: str):
    """Save historical stock data as JSON."""
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)


# Example usage:
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Get company overview from Alpha Vantage and analyze with Gemini"
    )
    parser.add_argument(
        "ticker", help="Ticker symbol of the company (e.g., AAPL, MSFT)"
    )

    args = parser.parse_args()
    try:
        # Create directory for ticker
        ticker_dir = os.path.join("lines", args.ticker)
        os.makedirs(ticker_dir, exist_ok=True)

        # Get company overview and historical data from Alpha Vantage
        overview = get_company_overview(args.ticker, ALPHA_VANTAGE_API_KEY)
        historical_data = get_historical_data(args.ticker, ALPHA_VANTAGE_API_KEY)
        news = get_stock_news(args.ticker, ALPHA_VANTAGE_API_KEY)

        # Save historical data
        historical_path = os.path.join(ticker_dir, f"{args.ticker}_historical.json")
        save_historical_data(historical_data, historical_path)
        print(f"\nSaved historical data to {historical_path}")

        # Print raw data
        print("\nRaw Company Data:")
        for key, value in overview.items():
            print(f"{key}: {value}")

        # Generate and save company description voice
        descrip_analysis = analyze_with_gemini(overview, [])
        descrip_path = os.path.join(ticker_dir, f"{args.ticker}_descrip.mp3")
        save_voice(descrip_analysis, descrip_path)
        print(f"\nSaved company description to {descrip_path}")

        print("\nLatest News Analysis:")
        for i, article in enumerate(news, 1):
            print(f"\nArticle {i}:")
            print(f"Headline: {article['title']}")
            print(f"Summary: {article['summary']}")
            print(f"Sentiment: {article.get('overall_sentiment_label', 'N/A')}")
            print("\nCarti's Analysis:")
            carti_analysis = analyze_news_with_gemini(article, args.ticker)
            print(carti_analysis)

            # Generate and save article voice
            article_path = os.path.join(ticker_dir, f"{args.ticker}_article{i}.mp3")
            save_voice(carti_analysis, article_path)
            print(f"Saved article {i} analysis to {article_path}")

            # Save article data as JSON
            article_json_path = os.path.join(
                ticker_dir, f"{args.ticker}_article{i}.json"
            )
            save_article_data(article, article_json_path)
            print(f"Saved article {i} data to {article_json_path}")
            print("-" * 80)

    except Exception as e:
        print(f"Error: {e}")
