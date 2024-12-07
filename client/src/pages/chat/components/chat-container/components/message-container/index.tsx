import { useAppStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Message } from '@/utils/types';
import { apiClient } from '@/lib/api-client';
import { GET_ALL_MESSAGES_ROUTE, HOST } from '@/utils/constants';
import { MdFolderZip } from 'react-icons/md';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData?._id },
          { withCredentials: true }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedChatData?._id) {
      if (selectedChatType === 'contact') {
        getMessages();
      }
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

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

  const checkIfImage = (filePath: string) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (fileUrl: string) => {
    const response = await apiClient.get(`${HOST}/${fileUrl}`, {
      responseType: 'blob',
    });
    const urlBlog = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlog;
    link.setAttribute('download', fileUrl.split('/').pop()!);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlog);
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
      {message.messageType === 'file' && (
        <div
          className={`${
            message.sender._id !== selectedChatData?._id
              ? 'bg-pastel-light-pink border-blue-600/50'
              : 'bg-pastel-sky-purple border-black/50'
          } border inline-block p-4 rounded-xl my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl!) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setImageUrl(message.fileUrl!);
                setShowImage(true);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-black/20 text-3xl bg-pastel-lavender/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl?.split('/').pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer hover:bg-black/50 transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl!)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-700">
        {moment(message.timestamp).format('LT')}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer hover:bg-black/50 transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full cursor-pointer hover:bg-black/50 transition-all duration-300"
              onClick={() => {
                setImageUrl('');
                setShowImage(false);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
