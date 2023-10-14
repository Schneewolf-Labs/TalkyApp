import { useState, useEffect } from 'react';
import { Message } from '../types';

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 1000; // start with 1 second delay

const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isUserTyping, setIsUserTyping] = useState(false);

    useEffect(() => {
        let retries = 0;
        let reconnectionDelay = INITIAL_DELAY_MS;

        if (ws) {
            ws.close(1000, "URL changed, initiating new connection");
            setWs(null);
        }

        const connect = () => {
            // Close any existing connections
            if (ws) {
                ws.close(1000, "Initiating new connection");
            }

            const websocket = new WebSocket(url);

            websocket.onopen = () => {
                console.log('Connected to the WebSocket');
                setIsConnected(true);
                setConnecting(false);
                // Reset retries and delay upon successful connection
                retries = 0;
                reconnectionDelay = INITIAL_DELAY_MS;
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
                    case 'receive_typing':
                        setIsUserTyping(true);
                        break;
                }
            };

            websocket.onclose = (event) => {
                console.log('Disconnected from the WebSocket');
                setIsConnected(false);
                setConnecting(false);

                // Reconnect if not closed intentionally and if under max retries
                if (!event.wasClean && retries < MAX_RETRIES) {
                    setTimeout(() => {
                        if (!connecting) {
                            console.log('Trying to reconnect to WebSocket...');
                            retries++;
                            reconnectionDelay *= 2; // double the delay for next retry
                            setConnecting(true);    // Set to connecting state to prevent multiple connections
                            connect();
                        }
                    }, reconnectionDelay);
                }
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

    return {
        isConnected,
        messages,
        sendMessage,
        isUserTyping
    };
};

export default useWebSocket;
