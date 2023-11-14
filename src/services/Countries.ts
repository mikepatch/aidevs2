class Countries {
  private API_URL: string;

  constructor() {
    this.API_URL = "https://restcountries.com/v3.1";
  }

  async getCountryInfo(countryName: string) {
    const options: RequestInit = { method: "GET" };

    return this._fetch(options, `/name/${countryName}`);
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

export default new Countries();
