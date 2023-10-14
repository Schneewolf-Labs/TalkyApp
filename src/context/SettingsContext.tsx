import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Setting } from '../types';

type SettingsProviderProps = {
  children: ReactNode;
};

const SettingsContext = createContext<Setting[]>([]);

// Utility functions for local storage
const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
}

const getFromLocalStorage = (key: string, defaultValue: any) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string>(getFromLocalStorage('username', 'TalkyApp'));
  const [apiUrl, setApiUrl] = useState<string>(getFromLocalStorage('apiUrl', 'ws://127.0.0.1:3000/api'));
  const [avatar, setAvatar] = useState<string>(getFromLocalStorage('avatar', 'default-avatar.png'));

  const settings = [
    { 
      name: 'username', 
      value: username, 
      setValue: (value: any) => { saveToLocalStorage('username', value); setUsername(value); } 
    },
    { 
      name: 'apiUrl', 
      value: apiUrl, 
      setValue: (value: any) => { saveToLocalStorage('apiUrl', value); setApiUrl(value); } 
    },
    { 
      name: 'avatar', 
      value: avatar, 
      setValue: (value: any) => { saveToLocalStorage('avatar', value); setAvatar(value); } 
    },
  ];

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
