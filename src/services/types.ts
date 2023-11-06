export type AuthorizeResponse = {
  code: number;
  msg: string;
  token: string;
};

export type TaskResponse = {
  code: number;
  msg: string;
  input: string | string[];
  cookie?: string;
  blog?: string[];
  answer?: string;
  question?: string;
};

export type AnswerType = string | string[] | number | number[] | object;

export type ModerateResult = {
  flagged: boolean;
  categories: object;
  category_scores: object;
};

export type ModerateResponse = {
  id: string;
  model: string;
  results: ModerateResult[];
};

export type GPTModel = "gpt-3.5-turbo" | "gpt-4";

export type CompletionMessage = {
  role: "system" | "user" | "assistant" | "function";
  content: string | null;
};

export type CompletionChoice = {
  message: CompletionMessage;
};

export type CompletionResponse = {
  choices: CompletionChoice[];
};

export type EmbeddingResponse = {};
