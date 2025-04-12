// Audio files
export const audioAssets = {
  AAPL: {
    1: require('../server/lines/aapl/aapl_article1.mp3'),
    2: require('../server/lines/aapl/aapl_article2.mp3'),
    3: require('../server/lines/aapl/aapl_article3.mp3'),
  },
  TSLA: {
    1: require('../server/lines/tsla/tsla_article1.mp3'),
    2: require('../server/lines/tsla/tsla_article2.mp3'),
    3: require('../server/lines/tsla/tsla_article3.mp3'),
  },
  PLTR: {
    1: require('../server/lines/pltr/pltr_article1.mp3'),
    2: require('../server/lines/pltr/pltr_article2.mp3'),
    3: require('../server/lines/pltr/pltr_article3.mp3'),
  },
  NET: {
    1: require('../server/lines/net/net_article1.mp3'),
    2: require('../server/lines/net/net_article2.mp3'),
    3: require('../server/lines/net/net_article3.mp3'),
  },
  MSTR: {
    1: require('../server/lines/mstr/mstr_article1.mp3'),
    2: require('../server/lines/mstr/mstr_article2.mp3'),
    3: require('../server/lines/mstr/mstr_article3.mp3'),
  },
  INTC: {
    1: require('../server/lines/intc/intc_article1.mp3'),
    2: require('../server/lines/intc/intc_article2.mp3'),
    3: require('../server/lines/intc/intc_article3.mp3'),
  },
  APP: {
    1: require('../server/lines/app/app_article1.mp3'),
    2: require('../server/lines/app/app_article2.mp3'),
    3: require('../server/lines/app/app_article3.mp3'),
  },
  DJT: {
    1: require('../server/lines/djt/djt_article1.mp3'),
    2: require('../server/lines/djt/djt_article2.mp3'),
    3: require('../server/lines/djt/djt_article3.mp3'),
  },
} as const;

// Historical data files
export const historicalDataAssets = {
  AAPL: require('../server/lines/aapl/aapl_historical.json'),
  TSLA: require('../server/lines/tsla/tsla_historical.json'),
  PLTR: require('../server/lines/pltr/pltr_historical.json'),
  NET: require('../server/lines/net/net_historical.json'),
  MSTR: require('../server/lines/mstr/mstr_historical.json'),
  INTC: require('../server/lines/intc/intc_historical.json'),
} as const;

// Article data files
export const articleDataAssets = {
  AAPL: {
    1: require('../server/lines/aapl/aapl_article1.json'),
    2: require('../server/lines/aapl/aapl_article2.json'),
    3: require('../server/lines/aapl/aapl_article3.json'),
  },
  TSLA: {
    1: require('../server/lines/tsla/tsla_article1.json'),
    2: require('../server/lines/tsla/tsla_article2.json'),
    3: require('../server/lines/tsla/tsla_article3.json'),
  },
  PLTR: {
    1: require('../server/lines/pltr/pltr_article1.json'),
    2: require('../server/lines/pltr/pltr_article2.json'),
    3: require('../server/lines/pltr/pltr_article3.json'),
  },
  NET: {
    1: require('../server/lines/net/net_article1.json'),
    2: require('../server/lines/net/net_article2.json'),
    3: require('../server/lines/net/net_article3.json'),
  },
  MSTR: {
    1: require('../server/lines/mstr/mstr_article1.json'),
    2: require('../server/lines/mstr/mstr_article2.json'),
    3: require('../server/lines/mstr/mstr_article3.json'),
  },
  INTC: {
    1: require('../server/lines/intc/intc_article1.json'),
    2: require('../server/lines/intc/intc_article2.json'),
    3: require('../server/lines/intc/intc_article3.json'),
  },
} as const;
