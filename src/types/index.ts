export type NewsLetterLink = {
  title: string;
  url: string;
  info: string;
  date: string;
};

export type NewsletterDocumentMetadata = {
  source: string;
  content: NewsLetterLink;
  uuid: string;
};

export type NewsletterDocument = {
  pageContent: NewsLetterLink;
  metadata: NewsletterDocumentMetadata;
};

