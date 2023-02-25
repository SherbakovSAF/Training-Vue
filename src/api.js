const API_KEY = "8a2f568b4445642de49bff74fc1df1cca20e845613170855ff41b9bdf6edf246"

const tickers = new Map()

export const loadTickers = (tickersName) =>
    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickersName.join(
            ","
        )}&tsyms=USD&api_key=${API_KEY}`
    )
        .then((r) => r.json())
        .then((rawData) =>
            Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
            )
        );

export const subscribeToTicker = (ticker, cb) =>{
     const subscribers = tickers.get(ticker) || []
     tickers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = (ticker, cb) =>{
     const subscribers = tickers.get(ticker)
     tickers.set(ticker, subscribers.filter(fn => fn != cb))
}

window.tickers = tickers