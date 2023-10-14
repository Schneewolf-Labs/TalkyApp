import React, { useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonList, IonItem, IonButton, IonIcon, IonButtons } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import MessageItem from '../components/MessageItem';
import MessageInput from '../components/MessageInput';
import useWebSocket from '../hooks/useWebSocket';
import { useSettings } from '../context/SettingsContext';
import './styles/Home.css';

const Home: React.FC = () => {
  const settings = useSettings(); 
  const apiUrl = settings.find(setting => setting.name === 'apiUrl')?.value || 'ws://127.0.0.1:3000/api';
  const username = settings.find(setting => setting.name === 'username')?.value || 'TalkyApp';

  const { messages, sendMessage, isUserTyping } = useWebSocket(apiUrl);

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
          <IonButtons slot="end">
            <IonButton routerLink="/settings">
              <IonIcon slot="icon-only" icon={settingsOutline} />
            </IonButton>
          </IonButtons>
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
          <IonItem>
            {isUserTyping && (
              <IonLabel>User is typing...</IonLabel>
            )}
          </IonItem>
        </IonList>

        <MessageInput onSend={(messageText) => {
          sendMessage({
            author: username,
            text: messageText,
          });
        }} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
