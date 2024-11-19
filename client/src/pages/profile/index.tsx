import { useAppStore } from '@/store';

const Profile = () => {
  const userInfo = useAppStore().userInfo;
  return <div>Email: {userInfo?.email}</div>;
};

export default Profile;
