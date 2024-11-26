import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { getColor } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoLogOut } from 'react-icons/io5';

const ProfileInfo = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-pastel-light-pink">
      <div className="flex gap-3 items-center justify-center">
        <div className="h-12 w-12 relative">
          <Avatar className="h-12 w-12  rounded-full overflow-hidden">
            {userInfo?.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover h-full w-full bg-pastel-sky-purple"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 text-lg border  flex items-center justify-center rounded-full ${getColor(userInfo?.color!)}`}
              >
                {userInfo?.firstName
                  ? userInfo?.firstName.split('').shift()
                  : userInfo?.email.split('').shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo?.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ''}
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={() => navigate('/profile')}>
              <FiEdit2 className="text-purple-500 text-xl font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-pastel-light-pink border-none">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={() => navigate('/profile')}>
              <IoLogOut className="text-red-500 text-xl font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-pastel-light-pink border-none">
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
