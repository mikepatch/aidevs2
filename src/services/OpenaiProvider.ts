import {
  CompletionMessage,
  CompletionResponse,
  ModerateResponse,
} from "./types";

class OpenaiProvider {
  private API_KEY: string;
  rootUrl: string;

  constructor() {
    this.API_KEY = process.env.OPENAI_API_KEY!;
    this.rootUrl = "https://api.openai.com/v1";
  }

  moderate(data: string | string[]) {
    const options = {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ input: data }),
    };

    return this._fetch(options, "/moderations") as Promise<ModerateResponse>;
  }

  getCompletion(messages: CompletionMessage[]) {
    const options = {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
      }),
    };

    return this._fetch(
      options,
      "/chat/completions"
    ) as Promise<CompletionResponse>;
  }

  private _getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.API_KEY}`,
    };

    return headers;
  }

  private async _fetch(options: RequestInit, additionalPath = "") {
    try {
      const url = this.rootUrl + additionalPath;
      const response = await fetch(url, options);

      return response.json();
    } catch (err) {
      throw new Error("ERROR");
    }
  }
}

export default new OpenaiProvider();
