import React, { useState } from 'react';

const ChatFilterButtons = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Unread', 'Archived', 'Blocked'];

  return (
    <div className="flex space-x-2 p-3 bg-white border-b border-gray-100">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-4 py-2 rounded-full text-xs font-semibold 
            ${activeFilter === filter 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 text-gray-700'} 
            focus:outline-none`}
          onClick={() => setActiveFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default ChatFilterButtons;
