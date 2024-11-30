import { User } from '@/pages/chat/components/contact-container/components/new-dm';
import { StateCreator } from 'zustand';

export interface ChatSlice {
  selectedChatType: string | undefined;
  selectedChatData: User | undefined;
  selectedChatMessage: string[];
  setSelectedChatMessage: (selectedChatMessage: string[]) => void;
  setSelectedChatType: (selectedChatType: string | undefined) => void;
  setSelectedChatData: (selectedChatData: User | undefined) => void;
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
