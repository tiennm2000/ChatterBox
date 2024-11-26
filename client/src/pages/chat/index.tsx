import { useAppStore } from '@/store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactContainer from './components/contact-container';
import ChatContainer from './components/chat-container';
import EmptyChatContainer from './components/empty-chat-container';

const Chat = () => {
  const { userInfo } = useAppStore();

  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast('Please setup profile to continue.');
      navigate('/profile');
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh]  overflow-hidden">
      <ContactContainer />
      {/* <EmptyChatContainer /> */}
      <ChatContainer />
    </div>
  );
};

export default Chat;
