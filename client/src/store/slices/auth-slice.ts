import { UserInfo } from '@/utils/types';
import { StateCreator } from 'zustand';

export interface AuthSlice {
  userInfo: UserInfo | undefined;
  setUserInfo: (userInfo: UserInfo | undefined) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  userInfo: undefined,
  setUserInfo: (userInfo) => set({ userInfo }),
});
