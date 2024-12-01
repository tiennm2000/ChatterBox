export interface UserInfo {
  id: string;
  email: string;
  profileSetup: boolean;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
}

export interface Message {
  id: string;
  sender: UserInfo;
  recipient?: UserInfo;
  messageType: 'text' | 'file';
  content?: string;
  fileUrl?: string;
  timestamp: Date;
}
