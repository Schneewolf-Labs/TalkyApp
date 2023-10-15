import { useState, useEffect } from 'react';
import { Message } from '../types';

let currentURL : string = '';

const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isUserTyping, setIsUserTyping] = useState(false);

    useEffect(() => {
        if (!url || url === currentURL) {
            console.log('url is empty or the same as the previous one');
            return;
        }

        const connect = () => {
            const websocket = new WebSocket(url);
            currentURL = url;

            websocket.onopen = () => {
                console.log('Connected to the WebSocket');
                setIsConnected(true);
                setConnecting(false);
            };

            websocket.onerror = () => {
                setConnecting(false);  // If there's an error, ensure we set connecting back to false
            };

            websocket.onmessage = (event) => {
                const incomingMessage = JSON.parse(event.data);
                switch (incomingMessage.event) {
                    case 'receive_message':
                        addMessage(incomingMessage.data);
                        setIsUserTyping(false);
                        break;
                    case 'receive_image':
                        addImage(incomingMessage.data.data);
                        setIsUserTyping(false);
                        break;
                    case 'receive_typing':
                        setIsUserTyping(true);
                        break;
                }
            };

            websocket.onclose = (event) => {
                console.log('Disconnected from the WebSocket');
                setIsConnected(false);
                setConnecting(false);
            };

            setWs(websocket);
        };

        if (!connecting) {
            setConnecting(true);
            connect();
        }

        return () => {
            ws?.close(1000, "Close by user"); // 1000 is a normal closure
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

    const addImage = (image: string) => {
        const newMessage = {
            image: image,
        };
        setMessages(prevMessages => {
            return [...prevMessages, newMessage];
        });
    };

    return {
        isConnected,
        messages,
        sendMessage,
        isUserTyping
    };
};

export default useWebSocket;
