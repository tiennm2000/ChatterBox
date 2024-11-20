import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import { useAppStore } from '@/store';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { UPDATE_PROFILE_ROUTE } from '@/utils/constants';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    if (userInfo?.profileSetup) {
      setFirstName(userInfo.firstName!);
      setLastName(userInfo.lastName!);
      setSelectedColor(userInfo.color!);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error('First name is required.');
      return false;
    }
    if (!lastName) {
      toast.error('Last name is required.');
      return false;
    }

    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        console.log(response.data);
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data.user });
          console.log(userInfo);
          toast.success('Profile updated successfully');
          navigate('/chat');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo?.profileSetup) {
      navigate('/chat');
    } else {
      toast.error('Please setup profile.');
    }
  };

  return (
    <div className="bg-pastel-peach h-[100vh] flex items-center justify-center gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack
            className="text-4xl lg:text-6xl cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover h-full w-full bg-pastel-sky-purple"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border  flex items-center justify-center rounded-full ${getColor(selectedColor)}`}
                >
                  {firstName
                    ? firstName.split('').shift()
                    : userInfo?.email.split('').shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-pastel-lavender/50 ring-fuchsia-50 rounded-full">
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            {/* <input type="text" /> */}
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col text-black items-center justify-center gap-5">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo?.email}
                className="rounded-lg p-6 bg-pastel-light-purple border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-pastel-light-purple border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-pastel-light-purple border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? 'outline outline-black/50 outline-1' : ''}`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
