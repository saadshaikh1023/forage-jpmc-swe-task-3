import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number| undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Calculate the price of ABC and DEF based on the top bid and ask prices
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;

    // Calculate the ratio of the prices
    const ratio = priceABC / priceDEF;

    // Define the upper and lower bounds for the ratio
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;

    // Return the data row
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp 
        ? serverRespond[0].timestamp 
        : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
