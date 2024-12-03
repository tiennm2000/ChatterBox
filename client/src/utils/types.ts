export interface UserInfo {
  _id: string;
  email: string;
  profileSetup: boolean;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
}

export interface Message {
  _id: string;
  sender: string;
  recipient?: string;
  messageType: 'text' | 'file';
  content?: string;
  fileUrl?: string;
  timestamp: Date;
}

export interface ReceivedMessage {
  _id: string;
  sender: UserInfo;
  recipient?: UserInfo;
  messageType: 'text' | 'file';
  content?: string;
  fileUrl?: string;
  timestamp: Date;
}
