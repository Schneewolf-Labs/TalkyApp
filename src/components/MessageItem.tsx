import React, { forwardRef } from 'react';
import { IonItem, IonLabel, IonAvatar, IonImg } from '@ionic/react';
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
        {props.message.image ? (
          // If there's an image in the message, render it as an <img> element with the base64 encoded data
          <IonImg src={`data:image/png;base64,${props.message.image}`} alt="Sent Image" />
        ) : (
          // Otherwise, display the text message
          <p className="message-text">{props.message.text}</p>
        )}
      </IonLabel>
    </IonItem>
  );
});

export default MessageItem;
