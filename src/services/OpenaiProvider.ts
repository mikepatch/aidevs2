import {
  CompletionMessage,
  CompletionResponse,
  GPTModel,
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

  getCompletion(
    messages: CompletionMessage[],
    model: GPTModel = "gpt-3.5-turbo"
  ) {
    const options = {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({
        model,
        messages,
      }),
    };

    return this._fetch(
      options,
      "/chat/completions"
    ) as Promise<CompletionResponse>;
  }

  getEmbedding(input: string) {
    const options: RequestInit = {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ input: input, model: "text-embedding-ada-002" }),
    };

    return this._fetch(options, "/embeddings");
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

      if (!response.ok)
        throw new Error(
          `Request failed with status ${response.status} ${response.statusText}`
        );

      return response.json();
    } catch (err) {
      console.error("Error: ", err);
    }
  }
}

export default new OpenaiProvider();
