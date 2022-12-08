const baseUrl = "https://www.alphavantage.co/query?apikey=9CNTM0OD3ES0536N";
const getStockInfo = (symbol) => {
  const url = baseUrl + "&function=OVERVIEW&symbol=" + symbol;
  return fetch(url);
};

const searchStock = (query) => {
  const url = baseUrl + "&function=SYMBOL_SEARCH&keywords=" + query;
  return fetch(url);
};

const getMonthlySeries = (symbol) => {
  const url =
    baseUrl + "&function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=" + symbol;
  return fetch(url);
};

const getDailySeries = (symbol) => {
  const url = baseUrl + "&function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + symbol;
  return fetch(url);
};

const getGlobalQuote = (symbol) => {
  const url = baseUrl + "&function=GLOBAL_QUOTE&symbol=" + symbol;
  return fetch(url);
};

export {
  getStockInfo,
  searchStock,
  getMonthlySeries,
  getDailySeries,
  getGlobalQuote,
};
