'use client';

import React, { createContext, FC, PropsWithChildren, useContext, useRef, useState } from 'react';

export type NotificationType = "Reedem"

export interface INotification {
  message?: string;
  status: 'success' | 'error';
  directLink?: string;
  type?: NotificationType,
  isRead?: boolean
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

    let notiElement = {
      message: notification.message,
      status: notification.status,
      directLink: notification.directLink,
      type: notification.type,
      isRead: false
    };

    try {
      if (!notiElement.status) { return }
      
      let notiArray = JSON.parse(localStorage.getItem('notifications') ?? "");
      notiArray.push(notiElement);

      localStorage.setItem("notifications", JSON.stringify(notiArray));
    } catch (error) {
      localStorage.setItem("notifications", JSON.stringify([notiElement]));
    }

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