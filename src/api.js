const API_KEY = "8a2f568b4445642de49bff74fc1df1cca20e845613170855ff41b9bdf6edf246"
export const loadTickers = tickersName => 
     fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickersName.join(",")}&api_key=${API_KEY}`)
     .then(data => data.json())
