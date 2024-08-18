import React from "react";
import { maleAvatar, femaleAvatar } from "../../public/logos";
import { timeAgo } from "../utils/dateFormatter";

const ChatListItem = ({ chat, onSelect }) => {
  return (
    <div
      className="flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 overflow-hidden"
      onClick={onSelect}
    >
      <img
        src={chat.gender === "male" ? maleAvatar : femaleAvatar}
        alt={chat.name}
        className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold truncate mr-2">{chat.name}</h3>
          <span className="text-xs text-gray-500 flex-shrink-0">{timeAgo(chat.updatedAt)}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{chat.message}</p>
      </div>
    </div>
  );
};

export default ChatListItem;