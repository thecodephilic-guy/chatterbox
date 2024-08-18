import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import ChatFilterButtons from "./ChatFilterButtons";
import ChatHeader from "./ChatHeader";
import ChatListItem from "./ChatListItem";
import ChatBody from "./ChatBody";
import apiService from "../../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const App = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.authStatus);
  const dbUpdated = useSelector((state) => state.auth.dbUpdated);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();

  const navigate = useNavigate();

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  useEffect(() => {
    if (!authStatus) {
      navigate("/login", { replace: true });
    }
  }, [authStatus, navigate]);

  useEffect(() => {
    socket.current = io('http://localhost:8080');

    socket.current.emit("add-new-user", currentUser.uid);
    socket.current.on("get-users", (activeUsers) => {
      setOnlineUsers(activeUsers);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const userChats = await apiService.userChats(currentUser?.uid);
        const chatUserIds = userChats.map((chat) =>
          chat.user1Id === currentUser?.uid ? chat.user2Id : chat.user1Id
        );

        const chatList = await fetchUserDetails(chatUserIds);
        setChatList(chatList);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [currentUser, dbUpdated]);

  const fetchUserDetails = async (userIds) => {
    try {
      const userDetailsArray = await Promise.all(
        userIds.map((id) => apiService.getUser(id))
      );
      return userDetailsArray;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return [];
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-full bg-white">
      <div
          className={`w-full md:w-2/6 border-r border-gray-200 flex flex-col ${
            selectedChat ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="sticky top-0 bg-white z-10">
            <SearchBar currentUserId={currentUser?.uid} />
            <ChatFilterButtons />
          </div>
          <div className="overflow-y-auto flex-grow">
            {chatList.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                onSelect={() => setSelectedChat(chat)}
              />
            ))}
          </div>
        </div>

        <div
          className={`flex-grow flex flex-col bg-white ${
            selectedChat ? "block" : "hidden md:flex"
          }`}
        >
          {selectedChat && (
            <ChatHeader
              onBack={handleBackToList}
              showBackButton={selectedChat !== null}
              user={selectedChat}
              socket={socket.current}
              currentUser={currentUser}
            />
          )}

          <div className="flex-grow overflow-hidden mt-16"> {/* Added mt-16 to account for fixed header */}
            {selectedChat ? (
              <ChatBody
                currentUser={currentUser}
                selectedUser={selectedChat}
                socket={socket.current}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;