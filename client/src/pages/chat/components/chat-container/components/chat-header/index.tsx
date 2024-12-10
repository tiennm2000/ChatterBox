import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { UserInfo } from '@/utils/types';
import { RiCloseFill } from 'react-icons/ri';

const ChatHeader = () => {
  let { closeChat, selectedChatData } = useAppStore();
  selectedChatData = selectedChatData as UserInfo;
  return (
    <div className="h-[10vh] border-b-2 border-pastel-light-pink flex items-center justify-between px-20 ">
      <div className="flex gap-5 items-center w-full justify-between ">
        <div className="flex gap-3 items-center justify-center">
          <div className="h-12 w-12 relative">
            <Avatar className="h-12 w-12  rounded-full overflow-hidden">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover h-full w-full bg-pastel-sky-purple"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border  flex items-center justify-center rounded-full ${getColor(selectedChatData?.color!)}`}
                >
                  {selectedChatData?.firstName
                    ? selectedChatData?.firstName.split('').shift()
                    : selectedChatData?.type === 'contact' &&
                      selectedChatData?.email.split('').shift()}
                </div>
              )}
            </Avatar>
          </div>
          {`${selectedChatData?.firstName} ${selectedChatData?.lastName}`}
        </div>

        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
