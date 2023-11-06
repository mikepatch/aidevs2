import { AnswerType, AuthorizeResponse, TaskResponse } from "./types";

class TasksProvider {
  protected API_KEY: string;
  protected token: string;
  rootUrl: string;

  constructor() {
    this.API_KEY = process.env.AIDEVS_API_KEY!;
    this.token = "";
    this.rootUrl = "https://zadania.aidevs.pl";
  }

  async getTask(taskName: string) {
    const options = { method: "GET" };

    await this._authorize(taskName);

    return this._fetch(options, `/task/${this.token}`) as Promise<TaskResponse>;
  }

  async getAnswer(taskName: string, question: string) {
    await this._authorize(taskName);

    const data = new URLSearchParams();
    data.append("question", question);
    const options: RequestInit = {
      method: "POST",
      body: data,
    };

    return this._fetch(options, `/task/${this.token}`) as Promise<TaskResponse>;
  }

  async sendAnswer(answer: AnswerType) {
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify({ answer }),
    };

    return this._fetch(options, `/answer/${this.token}`);
  }

  private async _authorize(taskName: string) {
    const options = {
      method: "POST",
      body: JSON.stringify({ apikey: this.API_KEY }),
    };

    const { token, msg, code } = (await this._fetch(
      options,
      `/token/${taskName}`
    )) as AuthorizeResponse;

    if (code < 0)
      throw console.error(
        `Authorization. Request failed with status ${code} ${msg}`
      );

    this.token = token;
  }

  private async _fetch(options: RequestInit, additionalPath = "") {
    try {
      const url = this.rootUrl + additionalPath;
      const response = await fetch(url, options);

      if (!response.ok)
        throw new Error(
          `TasksProvider.ts: Request failed with status ${response.status} ${response.statusText}`
        );

      return response.json();
    } catch (err) {
      throw console.error("Error: ", err);
    }
  }
}

export default new TasksProvider();
