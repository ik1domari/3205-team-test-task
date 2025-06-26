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
