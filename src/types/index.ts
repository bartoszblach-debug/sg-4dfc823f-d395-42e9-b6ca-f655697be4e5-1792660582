
export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: number;
  userId?: string;
  clicks: number;
  lastClickedAt?: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}
