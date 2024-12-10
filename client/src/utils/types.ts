import { Option } from '@/components/ui/multipleselect';

export interface UserInfo extends TypeChat {
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
  sender: UserInfo;
  recipient?: UserInfo;
  messageType: 'text' | 'file';
  content?: string;
  fileUrl?: string;
  timestamp: Date;
}

export interface Contact extends UserInfo {
  lastMessageTime: Date;
}

export interface UserGroupChannel extends Option {
  label: string;
  value: string;
}

export interface Channel extends TypeChat {
  _id: string;
  name: string;
  members: UserInfo[];
  admin: UserInfo;
}

export interface TypeChat {
  type: 'channel' | 'contact';
}
