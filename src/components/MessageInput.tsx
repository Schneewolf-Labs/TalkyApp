import React, { useState } from 'react';
import { IonInput, IonButton } from '@ionic/react';
import './styles/MessageInput.css';

type MessageInputProps = {
  onSend: (message: string) => void;
  connected: boolean;
};

const MessageInput: React.FC<MessageInputProps> = ({ connected, onSend }) => {
  const [input, setInput] = useState<string>('');

  const handleSendMessage = () => {
    if (input.trim()) { // Only send non-empty messages
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="message-input-container">
      <IonInput
        value={input}
        placeholder={connected ? "Enter your message" : "Disconnected..."}
        onIonChange={e => setInput(e.detail.value!)}
        onKeyDown={handleKeyDown}
        autoFocus={true}
      />
      <IonButton disabled={!connected} expand="block" onClick={handleSendMessage}>Send</IonButton>
    </div>
  );
};

export default MessageInput;
