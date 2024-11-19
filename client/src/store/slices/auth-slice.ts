import { StateCreator } from 'zustand';

interface UserInfo {
  id: string;
  email: string;
  profileSetup: boolean;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
}

export interface AuthSlice {
  userInfo: UserInfo | undefined;
  setUserInfo: (userInfo: UserInfo | undefined) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),
});
