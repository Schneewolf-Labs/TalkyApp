import React, { forwardRef } from 'react';
import { IonItem, IonLabel, IonAvatar } from '@ionic/react';
import { Message } from '../types';
import './styles/MessageItem.css';

type MessageItemProps = {
  message: Message;
};

const MessageItem = forwardRef<HTMLIonItemElement, MessageItemProps>((props, ref) => {
  return (
    <IonItem ref={ref} className="message-item">
      <IonAvatar slot="start">
        <img src="/avatar.png" alt="Avatar" />
      </IonAvatar>
      <IonLabel>
        <h2>{props.message.author}</h2>
        <p className="message-text">{props.message.text}</p>
      </IonLabel>
    </IonItem>
  );
});

export default MessageItem;
