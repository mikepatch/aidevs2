import { AnswerType, AuthorizeResponse, TaskResponse } from "./types";

class TasksProvider {
  protected API_KEY: string;
  protected token: string;
  rootUrl: string;

  constructor() {
    this.API_KEY = process.env.API_KEY!;
    this.token = "";
    this.rootUrl = process.env.ROOT_URL!;
  }

  async getTask(taskName: string) {
    const options = { method: "GET" };
    const { token, msg, code } = await this._authorize(taskName);

    if (code < 0) throw new Error(msg);

    this.token = token;

    return this._fetch(options, `/task/${token}`) as Promise<TaskResponse>;
  }

  async sendAnswer(answer: AnswerType) {
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify({ answer }),
    };

    return this._fetch(options, `/answer/${this.token}`);
  }

  private _authorize(taskName: string) {
    const options = {
      method: "POST",
      body: JSON.stringify({ apikey: this.API_KEY }),
    };

    return this._fetch(
      options,
      `/token/${taskName}`
    ) as Promise<AuthorizeResponse>;
  }

  private async _fetch(options: RequestInit, additionalPath = "") {
    try {
      const url = this.rootUrl + additionalPath;
      const response = await fetch(url, options);

      return response.json();
    } catch (err) {
      throw new Error("Connection error");
    }
  }
}

export default new TasksProvider();
