import Navbar from "../components/Navbar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full h-full px-4">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
