export interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface Notification {
  id: string;
  type: "NEW_COMMENT" | "FILE_SHARED" | "ACCESS_REQUEST" | "ACCESS_GRANTED";
  message: string;
  read: boolean;
  createdAt: Date;
  pdf?: {
    id: string;
    title: string;
  };
}

export interface PDF {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileKey: string;
  ufsUrl: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  sender?: {
    name: string;
    profileImageUrl?: string;
  };
  guestName?: string;
}
