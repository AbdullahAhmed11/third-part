import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';

const Chat = () => {

    const getUserInfo = () => {
      const token = Cookies.get('token');
      if (!token) return null;
    
      try {
        const decoded = jwtDecode(token);
    
        const name = decoded.Name;
        const id = decoded.Id;
        const role = decoded.Role;
        const image = decoded.Image;
    
        return { name, id, role, image };
      } catch (error) {
        console.error('Invalid token:', error);
        return null;
      }
    };
    
    const user = getUserInfo();
    
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [userChats, setUserChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([])
//   const [chatId, setChatId] = useState(null);

useEffect(() => {
  const fetchUserChats = async () => {
    try {
      setLoadingChats(true);
      const response = await axios.get(
        `https://thiredparty.runasp.net/api/Chtats/GetChatsByUser?id=${user.id}`
      );
      setUserChats(response.data);
      if (response.data.length > 0) {
        // Automatically select the first chat
        setSelectedChat(response.data[0]);
        // setChatId(response.data[0].chatId); // Uncomment and define setChatId if needed
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err);
      setError('Failed to load chats');
    } finally {
      setLoadingChats(false);
    }
  };

  if (user?.id) {
    fetchUserChats();
  }
}, [user?.id]);
const handleChatSelect = (chat) => {
  setSelectedChat(chat);
  // Optional: reset messages or trigger fetch for this chat
  // setMessages([]); or fetchMessages(chat.chatId)
};

const fetchMessages = async (chatId) => {
  try {
    const response = await axios.get(
      `https://thiredparty.runasp.net/api/Chtats/GetMessagesByChat?id=${chatId}&page=1&size=20`
    );
    setMessages(response.data);
    console.log(response.data, "rs")
    scrollToBottom();
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    setError('Failed to load messages');
  }
};

useEffect(() => {
  if (selectedChat?.chatId) {
    fetchMessages(selectedChat.chatId);
    console.log(selectedChat?.chatId, "selectedChat?.chatId")
  }
}, [selectedChat]);


  // Configuration
  const userId = user?.id; // Current user ID
  const chatId = selectedChat?.ChatId; // Chat group ID
  
  // State management
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState(null);
  const chatBoxRef = useRef(null);

  // Initialize SignalR connection
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://thiredparty.runasp.net/chatHub?userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    // Start connection and join chat
    newConnection.start()
      .then(() => {
        console.log('SignalR Connected!');
        newConnection.invoke("JoinChat", selectedChat?.ChatId);
      })
      .catch(err => {
        console.error('Connection failed:', err);
        setError(`Connection failed: ${err}`);
      });

    // Cleanup on component unmount
    return () => {
      if (newConnection) newConnection.stop();
    };
  }, []);

  // Set up message handlers
  useEffect(() => {
    if (!connection) return;

    connection.on("RecieveMessage", (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
      console.log(message, "message");
    });

    connection.on("Error", (error) => {
      console.error(error);
      setError(error);
    });

    return () => {
      connection.off("RecieveMessage");
      connection.off("Error");
    };
  }, [connection]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !connection) return;

    const messageObj = {
      ChatId: selectedChat?.chatId,
      RecieverId: null,
      SenderId: user?.id,
      Content: messageInput.trim()
    };
    console.log(messageObj, "obj")
    connection.invoke("SendMessage", messageObj)
      .catch(err => {
        console.error(err.toString());
        setError(`Failed to send message: ${err}`);
      });

    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
  
    <div className='w-full flex flex-col  gap-5'>
        <h2 className='text-[50px] font-bold'>Chats</h2>
      
        <div  className='w-full flex   gap-5'>
            <div className='w-1/3 bg-white rounded-lg shadow-md p-4'>
                <h3 className='text-xl font-semibold mb-4'>Your Conversations</h3>
                {loadingChats ? (
                    <div className="flex justify-center items-center h-64">
                    <p>Loading chats...</p>
                    </div>
                
                ) : userChats.length === 0 ? (
                    <p>No chats found</p>
                ) : (
                    <div className="space-y-2">
                    {userChats.map((chat) => (
                        <div
                        key={chat.chatId}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                            selectedChat?.chatId === chat.chatId ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                        onClick={() => handleChatSelect(chat)}
                        >
                        <div className="flex items-center gap-3">
                            <img 
                            src={`https://thiredparty.runasp.net/${chat.imagePath}`} 
                            alt={chat.senderName}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40';
                            }}
                            />
                            <div>
                            <p className="font-medium">{chat.senderName}</p>
                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
            {/* <div className='w-2/3 bg-white rounded-lg shadow-md h-[500px] p-4'>
                {selectedChat ? (
                    <div className='flex items-center gap-5'>
                        <img 
                            src={`https://thiredparty.runasp.net/${selectedChat?.imagePath}`} 
                            alt={selectedChat?.senderName}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40';
                            }} 
                        />
                    <h3 className="text-xl font-bold mb-2">{selectedChat.senderName}</h3>
                    </div>
                ) : (
                    <div className="text-gray-500">Select a chat to view details.</div>
                )}
                {
                    selectedChat ? (
                           <div >
                            {
                                chats.map((chat) => (
                                    <div key={chat.senderId} className=''>
                                        <h2>{chat.content}</h2>
                                    </div>
                                ))
                            }
                           </div>
                    ) : (
                        <div>selected chat</div>
                    )
                }
<div className='flex flex-col gap-5 '>

                  {messages.map((msg, idx) => (
                      <div key={idx} className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === user.id ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`}>
            <p className="text-sm">{msg.lastMessage || msg.content}</p>
            <p className="text-xs text-gray-500 text-right">{new Date(msg.sentAt).toLocaleTimeString()}</p>
          </div>
        ))}
        </div>
            <div className="mt-4 bottom-0">
                <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اكتب رسالتك هنا..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoComplete="off"
                />
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={sendMessage}
                >
                    إرسال
                </button>
                </div>
            </div>

            </div> */}
       <div className="w-2/3 bg-white rounded-lg shadow-md h-[500px] p-4 flex flex-col">
        {selectedChat ? (
            <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b pb-2">
                <img
                src={`https://thiredparty.runasp.net/${selectedChat?.imagePath}`}
                alt={selectedChat?.senderName}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40';
                }}
                />
                <h3 className="text-xl font-bold">{selectedChat.senderName}</h3>
            </div>

            {/* Scrollable Messages */}
            <div
                ref={chatBoxRef}
                className="flex-1 overflow-y-auto py-4 px-2 space-y-3"
            >
                {messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`max-w-[70%] px-4 py-2 rounded-lg break-words ${
                    msg.senderId === user.id
                        ? 'bg-blue-500 text-white self-end'
                        : 'bg-gray-200 text-gray-800 self-start'
                    }`}
                >
                    <p className="text-sm">{msg.content || msg.lastMessage}</p>
                    <p className="text-[10px] text-right opacity-70 mt-1">
                    {new Date(msg.sentAt).toLocaleTimeString()}
                    </p>
                </div>
                ))}
            </div>

            {/* Message Input */}
            {/* <div className="mt-2">
                <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اكتب رسالتك هنا..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoComplete="off"
                />
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                    onClick={sendMessage}
                >
                    إرسال
                </button>
                </div>
            </div> */}
            {/* Emoji & Input Area */}
<div className="mt-2 relative">
  <div className="flex items-center gap-2">
    {/* Emoji Toggle Button */}
    <button
      type="button"
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      className="text-xl"
    >
      😊
    </button>

    <input
      type="text"
      className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="اكتب رسالتك هنا..."
      value={messageInput}
      onChange={(e) => setMessageInput(e.target.value)}
      onKeyPress={handleKeyPress}
      autoComplete="off"
    />
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
      onClick={sendMessage}
    >
      إرسال
    </button>
  </div>

  {/* Emoji Picker Popup */}
  {showEmojiPicker && (
    <div className="absolute bottom-14 z-50">
      <EmojiPicker
        onEmojiClick={(emojiData) =>
          setMessageInput((prev) => prev + emojiData.emoji)
        }
      />
    </div>
  )}
</div>

            </>
        ) : (
            <div className="text-gray-500 flex justify-center items-center h-full">
            Select a chat to view details.
            </div>
        )}
</div>

        </div>

    </div>
  );
};

export default Chat;


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { HubConnectionBuilder } from '@microsoft/signalr';

// const Chat = () => {
//   // Configuration
//   const userId = 4; // Current user ID
//   const chatId = 45; // Chat group ID    
  
//   // State management
//   const [connection, setConnection] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const chatBoxRef = useRef(null);

//   // Fetch messages from API
//   const fetchMessages = useCallback(async (pageNumber) => {
//     if (isLoading || !hasMore) return;
    
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `https://thiredparty.runasp.net/api/Chtats/GetMessagesByChat?id=${chatId}&page=${pageNumber}&size=20`
//       );
//       const newMessages = await response.json();
      
//       if (newMessages.length === 0) {
//         setHasMore(false);
//       } else {
//         setMessages(prev => [...newMessages.reverse(), ...prev]);
//       }
//     } catch (err) {
//       console.error('Failed to fetch messages:', err);
//       setError(`Failed to load messages: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [chatId, isLoading, hasMore]);

//   // Initial load and page change
//   useEffect(() => {
//     fetchMessages(page);
//   }, [page, fetchMessages]);

//   // Initialize SignalR connection
//   useEffect(() => {
//     const newConnection = new HubConnectionBuilder()
//       .withUrl(`https://thiredparty.runasp.net/chatHub?userId=${userId}`)
//       .withAutomaticReconnect()
//       .build();

//     setConnection(newConnection);

//     newConnection.start()
//       .then(() => {
//         console.log('SignalR Connected!');
//         newConnection.invoke("JoinChat", chatId);
//       })
//       .catch(err => {
//         console.error('Connection failed:', err);
//         setError(`Connection failed: ${err}`);
//       });

//     return () => {
//       if (newConnection) newConnection.stop();
//     };
//   }, [userId, chatId]);

//   // Set up message handlers
//   useEffect(() => {
//     if (!connection) return;

//     connection.on("RecieveMessage", (message) => {
//       setMessages(prev => [...prev, message]);
//       scrollToBottom();
//     });

//     connection.on("Error", (error) => {
//       console.error(error);
//       setError(error);
//     });

//     return () => {
//       connection.off("RecieveMessage");
//       connection.off("Error");
//     };
//   }, [connection]);

//   // Handle scroll for infinite loading
//   const handleScroll = () => {
//     if (!chatBoxRef.current || isLoading || !hasMore) return;
    
//     const { scrollTop } = chatBoxRef.current;
//     if (scrollTop === 0) {
//       setPage(prev => prev + 1);
//     }
//   };

//   const scrollToBottom = () => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   };

//   const sendMessage = () => {
//     if (!messageInput.trim() || !connection) return;

//     const messageObj = {
//       ChatId: chatId,
//       RecieverId: null,
//       SenderId: userId,
//       Content: messageInput
//     };

//     connection.invoke("SendMessage", messageObj)
//       .catch(err => {
//         console.error(err.toString());
//         setError(`Failed to send message: ${err}`);
//       });

//     setMessageInput('');
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       sendMessage();
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-bold text-right mb-4">دردشة بسيطة مع SignalR</h2>
      
//       {error && (
//         <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}
      
//       <div 
//         ref={chatBoxRef}
//         className="h-64 border border-gray-300 rounded p-3 mb-4 overflow-y-auto"
//         onScroll={handleScroll}
//       >
//         {isLoading && page > 1 && (
//           <div className="text-center py-2 text-gray-500">جاري التحميل...</div>
//         )}
        
//         {messages.map((message, index) => (
//           <div key={index} className="mb-2 text-right">
//             <span className="font-bold">{message.senderId}</span>
//             <span className="text-xs text-gray-500 mr-1">
//               {new Date(message.sentAt).toLocaleTimeString()}
//             </span>
//             <span>: {message.content}</span>
//           </div>
//         ))}
//       </div>
      
//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="اكتب رسالتك هنا..."
//           value={messageInput}
//           onChange={(e) => setMessageInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           autoComplete="off"
//         />
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
//           onClick={sendMessage}
//         >
//           إرسال
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;


  // <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
    //   <h2 className="text-xl font-bold text-right mb-4">دردشة بسيطة مع SignalR</h2>
      
    //   {error && (
    //     <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
    //       {error}
    //     </div>
    //   )}
      
    //   <div 
    //     ref={chatBoxRef}
    //     className="h-64 border border-gray-300 rounded p-3 mb-4 overflow-y-auto"
    //   >
    //     {messages.map((message, index) => (
    //       <div key={index} className="mb-2 text-right">
    //         <span className="font-bold">{message.senderId}</span>
    //         <span className="text-xs text-gray-500 mr-1">
    //           {new Date(message.sentAt).toLocaleTimeString()}
    //         </span>
    //         <span>: {message.lastMessage}</span>
    //       </div>
    //     ))}
    //   </div>
      
    //   <div className="flex gap-2">
    //     <input
    //       type="text"
    //       className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       placeholder="اكتب رسالتك هنا..."
    //       value={messageInput}
    //       onChange={(e) => setMessageInput(e.target.value)}
    //       onKeyPress={handleKeyPress}
    //       autoComplete="off"
    //     />
    //     <button
    //       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
    //       onClick={sendMessage}
    //     >
    //       إرسال
    //     </button>
    //   </div>
    // </div>