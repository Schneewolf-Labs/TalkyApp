import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonList, IonItem } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  // State hooks
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  // WebSocket logic
  useEffect(() => {
    const websocket = new WebSocket('ws://127.0.0.1:3000/api');
    
    websocket.onopen = () => {
      console.log('Connected to the WebSocket');
    };

    websocket.onmessage = (event) => {
      const msg = event.data;
      const message = JSON.parse(msg);
      const data = message.data;

      switch (message.event) {
        case 'receive_message':
          setMessages((prevMessages) => [...prevMessages, data.text]);
          break;
        case 'receive_image':
          console.log('Image received');
          break;
        case 'receive_typing':
          console.log('Typing received');
          break;
        default:
          break;
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) {
      const message = {
        author: 'TalkyApp',
        text: input,
      };
      ws.send(JSON.stringify({
        event: 'send_message',
        data: message,
      }));
      setInput('');
    }
  };

  // Render UI
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TalkyApp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {messages.map((message, idx) => (
            <IonItem key={idx}>{message}</IonItem>
          ))}
        </IonList>

        <IonInput 
          value={input} 
          placeholder="Enter your message" 
          onIonChange={e => setInput(e.detail.value!)}
        />
        <IonButton expand="block" onClick={sendMessage}>Send</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
