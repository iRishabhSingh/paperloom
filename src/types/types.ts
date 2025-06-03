// types.ts
export type Role = "USER" | "ADMIN";
export type UserStatus = "ONLINE" | "OFFLINE" | "AWAY" | "DO_NOT_DISTURB";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DISABLED" | "DELETED";
export type ContrastMode = "BASIC" | "MEDIUM" | "HIGH";
export type DarkMode = "OFF" | "ON" | "AUTO";
export type Theme = "CLASSIC";
export type SharedStatus = "PENDING" | "ACCEPTED";
export type NotificationType =
  | "NEW_COMMENT"
  | "FILE_SHARED"
  | "ACCESS_REQUEST"
  | "ACCESS_GRANTED";

export interface User {
  id: string;
  role: Role;
  email: string;
  username: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  name: string;
  country?: string | null;
  isoCode?: string | null;
  phone?: string | null;
  passwordHash: string;
  emailVerified: boolean;
  twoFAEnabled: boolean;
  twoFASecret?: string | null;
  darkMode: DarkMode;
  contrastMode: ContrastMode;
  theme: Theme;
  profileImageUrl?: string | null;
  profileImageKey?: string | null;
  profileImageName?: string | null;
  profileImageSize?: number | null;
  profileImageType?: string | null;
  profileImageHash?: string | null;
  status: UserStatus;
  accountStatus: AccountStatus;
  region: string;
  shardKey?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PDF {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileKey: string;
  ufsUrl: string;
  fileHash: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface SharedUser {
  id: string;
  pdfId: string;
  userId: string;
  status: SharedStatus;
  canReshare: boolean;
  createdAt: Date;
  acceptedAt?: Date | null;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  userId: string;
  pdfId?: string | null;
  read: boolean;
  createdAt: Date;
}

export interface PublicShare {
  id: string;
  pdfId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImageUrl?: string;
}

// Component-specific types
export interface PDFCardProps {
  pdf: {
    id: string;
    title: string;
    fileName: string;
    fileSize: number;
    createdAt: Date | string;
  };
  onDelete: () => void;
}

export interface PDFUploadButtonProps {
  variant?: "primary" | "outline";
  size?: "normal" | "large";
  onUploadComplete?: (pdfId: string) => void;
}

export interface PDFOverviewProps {
  pdf: PDF & {
    owner: { name: string; email: string };
    sharedUsers: (SharedUser & { user: User })[];
  };
  userId: string;
  basePath: string;
}

export interface ShareViaEmailFormProps {
  pdfId: string;
  onCollaboratorAdded?: (collaborator: SharedUser & { user: User }) => void;
}

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfId: string | null;
}

export type GroupMessage = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  pdfId: string;
  senderId: string | null;
  sender?: {
    id: string;
    name: string | null;
    profileImageUrl: string | null;
  };
  guestName: string | null;
  guestEmail: string | null;
};

export type PDFChatViewProps = {
  pdf: {
    id: string;
    ufsUrl: string;
    title: string;
    ownerId: string;
  };
};
