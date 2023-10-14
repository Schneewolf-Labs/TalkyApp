import React from 'react';
import { IonItem, IonLabel, IonAvatar } from '@ionic/react';
import { Message } from '../types';

type MessageItemProps = {
  message: Message;
};

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <IonItem>
      <IonAvatar slot="start">
        <img src="/path/to/default/avatar.png" alt="Avatar" />
      </IonAvatar>
      <IonLabel>
        <h2>{message.author}</h2>
        <p>{message.text}</p>
      </IonLabel>
    </IonItem>
  );
};

export default MessageItem;
