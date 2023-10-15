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

  const handleKey = (event: React.KeyboardEvent) => {
    // Capture and set the value on each keystroke since IonChange is evil
    const inputElement = event.target as HTMLInputElement;
    setInput(inputElement.value);

    // send on enter stroke
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleInputChange = (e: CustomEvent) => {
    const value = e.detail.value!;
    setInput(value);
  };

  return (
    <div className="message-input-container">
      <IonInput
        value={input}
        placeholder={connected ? "Enter your message" : "Disconnected..."}
        onIonChange={handleInputChange}
        onKeyUp={handleKey}
        autoFocus={true}
      />
      <IonButton disabled={!connected} expand="block" onClick={handleSendMessage}>Send</IonButton>
    </div>
  );
};

export default MessageInput;
