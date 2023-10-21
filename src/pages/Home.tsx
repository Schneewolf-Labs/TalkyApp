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
  const apiUrl = settings.get('apiUrl').value;
  const username = settings.get('username').value;

  const { isConnected, messages, sendMessage, isUserTyping } = useWebSocket(apiUrl);

  // Handle scrolling on new messages
  const lastMessageRef = useRef<HTMLIonItemElement | null>(null);
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set title
  let title = 'TalkyApp';
  if (isConnected) {
    title += ' - Connected';
  } else {
    title += ' - Disconnected';
  }

  // Render UI
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
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
            />
          ))}
          <IonItem ref={lastMessageRef}>
            {isConnected && isUserTyping && (
              <IonLabel>User is typing...</IonLabel>
            )}
          </IonItem>
        </IonList>

        <MessageInput connected={isConnected} onSend={(messageText) => {
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
