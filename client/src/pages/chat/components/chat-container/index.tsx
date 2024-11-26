import ChatHeader from './components/chat-header';
import MessageBar from './components/message-bar';
import MessageContainer from './components/message-container';

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-pastel-salmon flex flex-col md:static flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
