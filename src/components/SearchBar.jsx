import React, { useEffect, useState } from "react";
import apiService from "../../services/api";
import { maleAvatar, femaleAvatar } from "../../public/logos";
import { useDispatch } from "react-redux";
import { setDbUpdated } from "../feature/authSlice.js";

function SearchBar({ currentUserId }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null)
  const dispatch = useDispatch();

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      if (input) {
        checkUser(input);
      }
    }, 1000);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [input]);

  const checkUser = async () => {
    try {
      const response = await apiService.searchUser(input);
      setResponse(response);
    } catch (error) {
      console.error(error);
    }
  };

  const startNewChat = async () => {
    try{
      console.log(currentUserId, response.uid);
      
      const newChat = await apiService.createChat(currentUserId, response.uid)
      dispatch(setDbUpdated(prevState => !prevState));
      setInput("")
    }catch (error){
      console.error(error);
    }
  };
  

  return (
    <div className="relative">
      <div className="flex px-3 bg-white py-4 border-b border-gray-100">
        <div className="flex items-center bg-gray-200 rounded-md p-2 shadow-sm w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M3 11a8 8 0 1116 0 8 8 0 01-16 0z"
            />
          </svg>
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none ml-2 text-sm text-gray-600 w-full"
          />
        </div>
      </div>
      {response?.uid ? (
        <button onClick={() => startNewChat()}>
        <div
          className={`${
            input
              ? "absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg"
              : "hidden"
          } `}
        >
          <div className="flex items-center p-2 hover:bg-gray-100">
            <img
              src={response.gender === "male" ? maleAvatar : femaleAvatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">{response.name}</p>
              <p className="text-sm text-gray-500 text-left">{response.username}</p>
            </div>
          </div>
        </div>
      </button>
      ) : <>
      <div
          className={`${
            input
              ? "absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg flex items-center justify-center py-5 font-bold"
              : "hidden"
          } `}
        ><p>{response}</p></div>
      </>}
    </div>
  );
}

export default SearchBar;
