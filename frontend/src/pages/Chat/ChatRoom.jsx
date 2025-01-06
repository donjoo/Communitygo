'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const ChatRoom = ({ receiverUsername }) => {
    const currentUser = useSelector((state) => state.auth.user);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const token = localStorage.getItem("ACCESS_TOKEN");

    useEffect(() => {
        socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${receiverUsername}/?token=${token}`);

        socketRef.current.onopen = () => {
            console.log('WebSocket connection established.');
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, { sender: data.sender, content: data.message }]);
        };

        return () => {
            socketRef.current.close();
        };
    }, [receiverUsername, token]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (inputValue.trim() !== '' && socketRef.current) {
            const messageData = {
                sender: currentUser.username,
                message: inputValue
            };
            socketRef.current.send(JSON.stringify(messageData));
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-lg">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-semibold">Chat with: {receiverUsername}</h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === currentUser.username ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                            msg.sender === currentUser.username 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white text-gray-800'
                        }`}>
                            <p className="font-semibold">{msg.sender}</p>
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white rounded-b-lg">
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder="Type a message" 
                        className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                        onClick={sendMessage}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;

