'use client';

import React, { createContext, FC, PropsWithChildren, useContext, useRef, useState } from 'react';

export interface INotification {
  message?: string;
  status: 'success' | 'error';
  directLink?: string;
}

interface INotificationContext {
  notification: INotification | null;
  addNotification: (notification: INotification) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<INotificationContext>({
  notification: null,
  addNotification: () => { },
  clearNotification: () => { },
});

const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [notification, setNotification] = useState<INotification | null>(null);

  const addNotification = (notification: INotification) => {
    setNotification(notification);

    setTimeout(() => {
      clearNotification();
    }, 2500);
  }
  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{ notification, addNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => useContext(NotificationContext);

export { NotificationProvider, useNotification };