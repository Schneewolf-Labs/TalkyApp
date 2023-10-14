import { useState, useEffect } from 'react';
import { Message } from '../types';

const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isUserTyping, setIsUserTyping] = useState(false);

    useEffect(() => {
        const websocket = new WebSocket(url);

        websocket.onopen = () => {
            console.log('Connected to the WebSocket');
        };

        websocket.onmessage = (event) => {
            const incomingMessage = JSON.parse(event.data);
            switch (incomingMessage.event) {
                case 'receive_message':
                    addMessage(incomingMessage.data);
                    setIsUserTyping(false);
                    break;
                case 'receive_typing':
                    setIsUserTyping(true);
                    break;
            }
        };

        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, [url]);

    const sendMessage = (message: Message) => {
        if (ws && ws.readyState === WebSocket.OPEN && message.text) {
            ws.send(JSON.stringify({
                event: 'send_message',
                data: message,
            }));
            // add message to local history
            addMessage(message);
        }
    };
    

    const addMessage = (newMessage: { author: string; text: string }) => {
        setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            // If the previous message and the new one are from the same author
            if (lastMessage && lastMessage.author === newMessage.author) {
                // Clone the last message and append the new text
                const updatedMessage = {
                    ...lastMessage,
                    text: `${lastMessage.text}\n${newMessage.text}`
                };

                // Replace the last message with the updated one
                return [...prevMessages.slice(0, -1), updatedMessage];
            } else {
                // If the author is different, just add the new message
                return [...prevMessages, newMessage];
            }
        });
    };

    return {
        messages,
        sendMessage,
        isUserTyping
    };
};

export default useWebSocket;
