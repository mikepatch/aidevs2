export type DocumentType = {
  [key: string]: any;
};

export type PayloadType = {
  [key: string]: any;
};

export type CollectionPoint = {
  id: string;
  payload: PayloadType;
  vector: number[];
};
