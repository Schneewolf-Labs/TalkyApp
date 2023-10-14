import { useState, useEffect } from 'react';
import { Message } from '../types';

const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const websocket = new WebSocket(url);

        websocket.onopen = () => {
            console.log('Connected to the WebSocket');
        };

        websocket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            const data: Message = {
                author: msg.data.author,
                text: msg.data.text,
            };

            switch (msg.event) {
                case 'receive_message':
                    setMessages((prevMessages) => [...prevMessages, data]);
                    break;
                // ... other cases remain unchanged
            }
        };

        setWs(websocket);

        return () => {
            websocket.close();
        };
    }, [url]);

    const sendMessage = (message: Message) => {
        if (ws) {
            ws.send(JSON.stringify({
                event: 'send_message',
                data: message,
            }));
        }
    };

    return {
        messages,
        sendMessage
    };
};

export default useWebSocket;
