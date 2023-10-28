export type AuthorizeResponse = {
  code: number;
  msg: string;
  token: string;
};

export type TaskResponse = {
  code: number;
  msg: string;
  input: string;
  cookie?: string;
  blog?: string[];
};

export type AnswerType = string | string[] | number | number[];

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
