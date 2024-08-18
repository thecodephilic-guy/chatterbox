import React, { useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { GrAttachment } from "react-icons/gr";

const SendMessageBar = () => {
    const [message, setMessage] = useState("");
    

  return (
    <div className="flex bg-white px-5 py-3 w-full items-center justify-center border-t border-gray-100">
      <div className="flex items-center bg-gray-100 p-2 rounded-md space-x-5 w-full">
        <input
        onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type your message here"
          className="flex-grow bg-transparent focus:outline-none text-sm text-gray-600"
        />
        <div className="flex right-0">
          {/* <button>
            <GrAttachment color="#f97316" />
          </button> */}
          <button className="ml-4 bg-orange-300/50 p-2 rounded-md text-white hover:bg-orange-300/70 focus:outline-none">
            <LuSendHorizonal color="#f97316" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageBar;
