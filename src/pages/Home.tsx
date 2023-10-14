import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonList, IonItem } from '@ionic/react';
import MessageItem from '../components/MessageItem';
import MessageInput from '../components/MessageInput';
import useWebSocket from '../hooks/useWebSocket';
import './Home.css';

const Home: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const { messages, sendMessage } = useWebSocket('ws://127.0.0.1:3000/api');

  const handleSendMessage = () => {
    sendMessage({
      author: 'TalkyApp',
      text: input,
    });
    setInput('');
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
            <MessageItem key={idx} message={message} />
          ))}
        </IonList>

        <MessageInput onSend={(messageText) => {
          sendMessage({
            author: 'TalkyApp',
            text: messageText,
          });
        }} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
