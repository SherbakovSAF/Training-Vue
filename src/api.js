const API_KEY = "8a2f568b4445642de49bff74fc1df1cca20e845613170855ff41b9bdf6edf246"

const tickersHandlers = new Map()
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)
const AGGREGATE_INDEX = '5'

// Отслеживание события ВебСокета с извлечением данных для замены
socket.addEventListener("message", (e) => {
    const {
        TYPE: type,
        FROMSYMBOL: currency,
        PRICE: newPrice,
    } = JSON.parse(e.data);
    if (newPrice === undefined) {
        return;
    }
    if (type != AGGREGATE_INDEX) {
        return;
    }
    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach((fn) => fn(newPrice));
});

// Отправление сообщения для подписки на тикет
function sendToWebSocket(message){
    const stringifiedMessage = JSON.stringify(message)
    if(socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage)
        return
    }
    socket.addEventListener('open',()=>{
        socket.send(stringifiedMessage)
    },
    {once: true})
}

// Шаблон сообщения для подписки на получение данных из WebSocket'a
function subscribeToTickerOwnWS(ticker){
    sendToWebSocket({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    })
}

// Шаблон сообщения для отписки на получение данных из WebSocket'a
function unsubscribeFromTickerOwnWS(ticker){
    sendToWebSocket({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    })
}

// Добавление названия тикера из отслеживаемых WebSocketon названий
export const subscribeToTicker = (ticker, cb) =>{
     const subscribers = tickersHandlers.get(ticker) || []
     tickersHandlers.set(ticker, [...subscribers, cb])
     subscribeToTickerOwnWS(ticker)
}

// Удаления названия тикера из отслеживаемых WebSocketon названий
export const unsubscribeFromTicker = (ticker) =>{
    tickersHandlers.delete(ticker)
    unsubscribeFromTickerOwnWS(ticker)
}

