export interface UserInfo {
  _id: string;
  email: string;
  profileSetup: boolean;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
}
