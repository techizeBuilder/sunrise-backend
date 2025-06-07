export interface Stats {
  totalProducts: number;
  galleryImages: number;
  messages: number;
  unreadMessages: number;
  pageViews: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}
