import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './slices/auth-slice';
import { ChatSlice, createChatSlice } from './slices/chat-slice';

export const useAppStore = create<AuthSlice & ChatSlice>()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));
