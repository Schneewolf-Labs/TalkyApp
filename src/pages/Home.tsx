import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonList, IonItem } from '@ionic/react';
import MessageItem from '../components/MessageItem';
import MessageInput from '../components/MessageInput';
import useWebSocket from '../hooks/useWebSocket';
import './Home.css';

const Home: React.FC = () => {
  const { messages, sendMessage } = useWebSocket('ws://127.0.0.1:3000/api');
  
  // Handle scrolling on new messages
  const lastMessageRef = useRef<HTMLIonItemElement | null>(null);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            <MessageItem key={idx} 
              message={message}
              ref={idx === messages.length - 1 ? lastMessageRef : null}
            />
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
