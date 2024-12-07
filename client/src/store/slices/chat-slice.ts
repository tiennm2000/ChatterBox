import { Contact, Message, UserInfo } from '@/utils/types';
import { StateCreator } from 'zustand';

export interface ChatSlice {
  selectedChatType: 'channel' | 'contact' | undefined;
  selectedChatData: UserInfo | undefined;
  selectedChatMessages: Message[];
  setSelectedChatMessages: (selectedChatMessages: Message[]) => void;
  setSelectedChatType: (
    selectedChatType: 'channel' | 'contact' | undefined | undefined
  ) => void;
  setSelectedChatData: (selectedChatData: UserInfo | undefined) => void;
  closeChat: () => void;
  addMessage: (message: Message) => void;
  directMessageContacts: Contact[];
  setDirectMessageContacts: (directMessageContacts: Contact[]) => void;
  isUploading: boolean;
  isDownloading: boolean;
  fileUploadProgress: number;
  fileDownloadProgress: number;
  setIsUploading: (isUploading: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setFileUploadProgress: (fileUploadProgress: number) => void;
  setFileDownloadProgress: (fileDownloadProgress: number) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessageContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  setIsUploading(isUploading) {
    set({ isUploading });
  },
  setIsDownloading(isDownloading) {
    set({ isDownloading });
  },
  setFileUploadProgress(fileUploadProgress) {
    set({ fileUploadProgress });
  },
  setFileDownloadProgress(fileDownloadProgress) {
    set({ fileDownloadProgress });
  },
  setSelectedChatData(selectedChatData) {
    set({ selectedChatData });
  },
  setSelectedChatType(selectedChatType) {
    set({ selectedChatType });
  },
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessageContacts(directMessageContacts) {
    set({ directMessageContacts });
  },
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
