export type AuthorizeResponse = {
  code: number;
  msg: string;
  token: string;
};

export type TaskResponse = {
  code: number;
  msg: string;
  cookie: string;
};
