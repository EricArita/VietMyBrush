export interface WebConfiguration {
  cors: {
    whitelistUrls: string[];
  };
  api: {
    prefix: string;
    docsUrl: string;
    docsJson: string;
  };
  log: {
    apiRequest: boolean;
  };
}
