import { ModerateResponse } from "./types";

class OpenaiProvider {
  private API_KEY: string;
  rootUrl: string;

  constructor() {
    this.API_KEY = process.env.OPENAI_API_KEY!;
    this.rootUrl = "https://api.openai.com/v1/moderations";
  }

  moderate(data: string | string[]) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.API_KEY}`,
      },
      body: JSON.stringify({ input: data }),
    };

    return this._fetch(options) as Promise<ModerateResponse>;
  }

  private async _fetch(options: RequestInit) {
    try {
      const response = await fetch(this.rootUrl, options);

      return response.json();
    } catch (err) {
      throw new Error("ERROR");
    }
  }
}

export default new OpenaiProvider();
