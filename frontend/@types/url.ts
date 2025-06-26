export type Url = {
  id: number;
  originalUrl: string;
  shortUrl: string;
  alias?: string;
  clickCount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUrlDto = {
  originalUrl: string;
  alias?: string;
  expiresAt?: Date;
};

export type AnalyticsResponseDto = {
  clickCount: number;
  lastIps: string[];
};
