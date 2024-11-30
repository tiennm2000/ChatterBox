import { UserInfo } from '@/utils/types';
import { StateCreator } from 'zustand';

export interface ChatSlice {
  selectedChatType: string | undefined;
  selectedChatData: UserInfo | undefined;
  selectedChatMessage: string[];
  setSelectedChatMessage: (selectedChatMessage: string[]) => void;
  setSelectedChatType: (selectedChatType: string | undefined) => void;
  setSelectedChatData: (selectedChatData: UserInfo | undefined) => void;
  closeChat: () => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessage: [],
  setSelectedChatData(selectedChatData) {
    set({ selectedChatData });
  },
  setSelectedChatType(selectedChatType) {
    set({ selectedChatType });
  },
  setSelectedChatMessage: (selectedChatMessage) => set({ selectedChatMessage }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessage: [],
    }),
});
