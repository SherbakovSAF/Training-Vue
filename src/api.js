const API_KEY = "8a2f568b4445642de49bff74fc1df1cca20e845613170855ff41b9bdf6edf246"

const tickersHandlers = new Map()

const loadTickers = () => {
    
    if(tickersHandlers.size === 0){
        return
    }
    
    fetch(   
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(
            ","
        )}&tsyms=USD&api_key=${API_KEY}`
    )
        .then((r) => r.json())
        .then((rawData) =>{
            const updatedPrices = Object.fromEntries(Object.entries(rawData).map(([key, value]) => [key, value.USD]))
            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) ?? []
                handlers.forEach(fn => fn(newPrice))
            })
        }
        );
}
    
export const subscribeToTicker = (ticker, cb) =>{
     const subscribers = tickersHandlers.get(ticker) || []
     tickersHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = (ticker) =>{
    tickersHandlers.delete(ticker)
    //  const subscribers = tickersHandlers.get(ticker)
    //  tickersHandlers.set(ticker, subscribers.filter(fn => fn != cb))
}

setInterval(loadTickers, 5000)

window.tickersHandlers = tickersHandlers