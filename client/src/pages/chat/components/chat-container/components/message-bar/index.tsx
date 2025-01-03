import { useEffect, useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from '@/store';
import { useSocket } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client';
import { UPLOAD_FILE_ROUTE } from '@/utils/constants';

const MessageBar = () => {
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let {
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
    selectedChatType,
    selectedChatChannel,
    directMessageContacts,
    setDirectMessageContacts,
  } = useAppStore();
  const socket = useSocket();

  const handleAddEmoji = (emojiObject: { emoji: string }) => {
    setMessage((msg: string) => msg + emojiObject.emoji);
  };

  useEffect(() => {
    function handleClickOutSide(event: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node))
        setEmojiPickerOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutSide);
    return () => document.removeEventListener('mousedown', handleClickOutSide);
  }, [emojiRef]);

  const [message, setMessage] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleSendMessage = async () => {
    if (selectedChatType === 'contact') {
      socket?.emit('sendMessage', {
        sender: userInfo?._id,
        content: message,
        recipient: selectedChatData?._id,
        messageType: 'text',
        fileUrl: undefined,
      });
      const newContactId = directMessageContacts.findIndex(
        (contact) => contact._id === selectedChatData?._id
      );
      if (newContactId === -1) {
        setDirectMessageContacts([
          { ...selectedChatData!, lastMessageTime: new Date(Date.now()) },
          ...directMessageContacts,
        ]);
      }
    } else if (selectedChatType === 'channel') {
      socket?.emit('send-channel-message', {
        sender: userInfo?._id,
        content: message,
        messageType: 'text',
        fileUrl: undefined,
        channelId: selectedChatChannel?._id,
      });
    }
    setMessage('');
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files![0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(
              Math.round((100 * data.loaded) / data.total!)
            );
          },
        });
        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === 'contact') {
            socket?.emit('sendMessage', {
              sender: userInfo?._id,
              content: undefined,
              recipient: selectedChatData?._id,
              messageType: 'file',
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === 'channel') {
            socket?.emit('send-channel-message', {
              sender: userInfo?._id,
              content: undefined,
              messageType: 'file',
              fileUrl: response.data.filePath,
              channelId: selectedChatChannel?._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error(error);
    }
  };

  return (
    <div className="h-[10vh] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-pastel-light-purple rounded-md items-center gap-5 pr-5 ">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAttachmentChange}
          />
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-pastel-light-pink rounded-md flex items-center justify-center p-5 hover:bg-pastel-sky-purple  hover:border-none hover:outline-none hover:text-white duration-300 transition-all"
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
