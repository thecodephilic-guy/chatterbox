import React, { useState, useEffect, useRef } from "react";
import apiService from "../../services/api";
import { LuSendHorizonal } from "react-icons/lu";
import { timeAgo } from "../utils/dateFormatter";

const ChatBody = ({ currentUser, selectedUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadChat();
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        scrollToBottom();
      });
    }

    return () => {
      if (socket) {
        socket.off("receive-message");
      }
    };
  }, [socket]);

  const loadChat = async () => {
    try {
      const chat = await apiService.findChat(currentUser.uid, selectedUser.id);
      if (chat.length > 0) {
        setChatId(chat[0].id);
        loadMessages(chat[0].id);
      } else {
        setChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const loadMessages = async (id) => {
    try {
      const fetchedMessages = await apiService.getMessages(id);
      setMessages(fetchedMessages.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)));
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const createChat = async () => {
    try {
      const newChat = await apiService.createChat(currentUser.uid, selectedUser.id);
      setChatId(newChat.id);
      return newChat.id;
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const sendMessage = async (content) => {
    try {
      let currentChatId = chatId;
      if (!currentChatId) {
        currentChatId = await createChat();
      }
      const newMessage = await apiService.addMessage(currentChatId, currentUser.uid, content);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Send the message through socket
      socket.emit("send-message", {
        receiverId: selectedUser.id,
        message: newMessage,
      });

      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const renderMessage = (message) => {
    const isCurrentUser = message.senderId === currentUser.uid;
    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            isCurrentUser ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          <p>{message.content}</p>
          <span className={`text-xs mt-1 ${isCurrentUser ? "text-gray-200" : "text-gray-500"}`}>
            {timeAgo(message.updatedAt)}
          </span>
        </div>
      </div>
    );
  };
  const handleTyping = (e) => {
    if (e.target.value.length > 0) {
      socket.emit('user-typing', { userId: currentUser.uid, receiverId: selectedUser.id });
    } else {
      socket.emit('user-stop-typing', { userId: currentUser.uid, receiverId: selectedUser.id });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 flex flex-col-reverse">
        <div>
          {messages.map(renderMessage)}
        </div>
      </div>
      <div className="flex bg-white px-5 py-3 w-full items-center justify-center border-t border-gray-100">
        <div className="flex items-center bg-gray-100 p-2 rounded-md w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const content = e.target.message.value;
              if (content.trim()) {
                sendMessage(content);
                e.target.reset();
                socket.emit('user-stop-typing', { userId: currentUser.uid, receiverId: selectedUser.id });
              }
            }}
            className="flex items-center w-full"
          >
            <input
              name="message"
              type="text"
              placeholder="Type your message here"
              className="flex-grow bg-transparent focus:outline-none text-sm text-gray-600"
              onChange={handleTyping}
            />
            <button className="ml-4 bg-orange-300/50 p-2 rounded-md text-white hover:bg-orange-300/70 focus:outline-none">
              <LuSendHorizonal color="#f97316" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;