import { Message, UserInfo } from '@/utils/types';
import { StateCreator } from 'zustand';

export interface ChatSlice {
  selectedChatType: string | undefined;
  selectedChatData: UserInfo | undefined;
  selectedChatMessages: Message[];
  setSelectedChatMessages: (selectedChatMessages: Message[]) => void;
  setSelectedChatType: (selectedChatType: string | undefined) => void;
  setSelectedChatData: (selectedChatData: UserInfo | undefined) => void;
  closeChat: () => void;
  addMessage: (message: Message) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  setSelectedChatData(selectedChatData) {
    set({ selectedChatData });
  },
  setSelectedChatType(selectedChatType) {
    set({ selectedChatType });
  },
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage(message) {
    const selectedChatMessages = get().selectedChatMessages;
    // const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
        },
      ],
    });
  },
});
