import { Channel, Contact, Message, UserInfo } from '@/utils/types';

import { StateCreator } from 'zustand';

export interface ChatSlice {
  selectedChatData: UserInfo | undefined;
  selectedChatType: 'contact' | 'channel' | undefined;
  selectedChatChannel: Channel | undefined;
  setSelectedChatChannel: (selectedChatChannel: Channel | undefined) => void;
  setSelectedChatType: (selectedChatType: 'contact' | 'channel') => void;
  selectedChatMessages: Message[];
  setSelectedChatMessages: (selectedChatMessages: Message[]) => void;
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
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
  addChannel: (channel: Channel) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set, get) => ({
  selectedChatData: undefined,
  selectedChatType: undefined,
  selectedChatChannel: undefined,
  selectedChatMessages: [],
  directMessageContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  setSelectedChatType(selectedChatType) {
    set({ selectedChatType });
  },
  setSelectedChatChannel(selectedChatChannel) {
    set({ selectedChatChannel });
  },
  setChannels: (channels) => set({ channels }),
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

  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessageContacts(directMessageContacts) {
    set({ directMessageContacts });
  },
  addChannel(channel) {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatChannel: undefined,
      selectedChatMessages: [],
    }),
  addMessage(message) {
    const selectedChatMessages = get().selectedChatMessages;
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
