import { useEffect, useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import { useAppStore } from '@/store';
import { useSocket } from '@/context/SocketContext';

const MessageBar = () => {
  const emojiRef = useRef<HTMLDivElement>(null);
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
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
      setMessage('');
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
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
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
