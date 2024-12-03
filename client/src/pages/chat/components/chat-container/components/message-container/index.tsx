import { useAppStore } from '@/store';
import { useEffect, useRef } from 'react';
import moment from 'moment';
import { Message } from '@/utils/types';

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { selectedChatType, selectedChatData, selectedChatMessages } =
    useAppStore();
  console.log(selectedChatMessages);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate: null | string = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-700 my-2">
              {moment(message.timestamp).format('LL')}
            </div>
          )}
          {selectedChatType === 'contact' && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message: Message) => (
    <div
      className={
        message.sender._id === selectedChatData?._id
          ? 'text-left'
          : 'text-right'
      }
    >
      {message.messageType === 'text' && (
        <div
          className={`${
            message.sender._id !== selectedChatData?._id
              ? 'bg-pastel-light-pink border-blue-600/50'
              : 'bg-pastel-sky-purple border-black/50'
          } border inline-block p-4 rounded-xl my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      <div className="text-xs text-gray-700">
        {moment(message.timestamp).format('LT')}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
