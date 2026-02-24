export type GithubUser = {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
};

export type GithubUserSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GithubUser[];
};

export type GithubUserSearchErrorType =
  | 'NONE'
  | 'NETWORK'
  | 'RATE_LIMIT'
  | 'VALIDATION'
  | 'UNKNOWN';
