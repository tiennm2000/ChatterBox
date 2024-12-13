import { useAppStore } from '@/store';
import { Channel } from '@/utils/types';
import { Avatar } from './ui/avatar';

const ChannelList = () => {
  let {
    selectedChatChannel,
    setSelectedChatChannel,
    setSelectedChatMessages,
    channels,
    setSelectedChatType,
  } = useAppStore();

  const handleClick = (channel: Channel) => {
    setSelectedChatChannel(channel);
    setSelectedChatType('channel');

    if (selectedChatChannel && selectedChatChannel._id !== channel._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {channels.map((channel) => (
        <div
          key={channel._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
      ${selectedChatChannel && selectedChatChannel._id === channel._id ? 'bg-pastel-light-pink hover:bg-pastel-sky-purple' : 'hover:bg-pastel-salmon'} `}
          onClick={() => handleClick(channel)}
        >
          <div className="flex gap-5 items-center justify-start text-black">
            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
              <div
                className={`uppercase h-10 w-10 text-lg border flex items-center justify-center rounded-full ${selectedChatChannel?._id === channel._id ? 'bg-pastel-peach border-2 border-white' : 'bg-gray-500 border-gray-400 text-white'}`}
              >
                #
              </div>
            </Avatar>

            <span>{channel.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChannelList;
