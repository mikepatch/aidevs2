class ExchangeRates {
  private API_URL: string;

  constructor() {
    this.API_URL = "http://api.nbp.pl/api";
  }

  async getCurrentRate(symbol: string) {
    const options: RequestInit = {
      method: "GET",
    };
    return this._fetch(options, `/exchangerates/rates/a/${symbol}`);
  }

  private async _fetch(options: RequestInit, additionalPath = "") {
    try {
      const url = this.API_URL + additionalPath;
      const response = await fetch(url, options);

      return response.json();
    } catch (err) {
      throw console.error("Error: ", err);
    }
  }
}

export default new ExchangeRates();
