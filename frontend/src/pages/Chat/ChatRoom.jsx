import React , {useEffect,useState} from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';


const ChatRoom = ({ receiverUsername }) => {
    const currentUser = useSelector((state) => state.auth.user) 
    const [messages, setMessages ] = useState([]);
    const [inputValue,setInputValue] = useState('');
    const socketRef = useRef(null); // Use a ref for the socket
    const token = localStorage.getItem("ACCESS_TOKEN");


    useEffect(() => {

        socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${receiverUsername}/?token=${token}`);

      
        
        socketRef.current.onopen = () => {
            console.log('WebSocket connection established.');
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, { sender:data.sender, content:data.message}]);


        };


        return () => {
            socketRef.current.close();
        };
    
    },[receiverUsername]);



    const sendMessage = () => {
        if (inputValue.trim() !== '' && socketRef.current) {
            const messageData = {
                sender: currentUser.username, // Include current user's username
                message: inputValue
            };
            socketRef.current.send(JSON.stringify(messageData));
            setInputValue('');
        }
    };

    return (
        <div>
            <h2>Chat with: {receiverUsername}</h2>
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid black', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index}><strong>{msg.sender}:</strong> {msg.content}</div>
                ))}
            </div>
            <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="Type a message" 
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );



 };

export default ChatRoom;
